import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { transactions } = useAppContext();

  // Compute stats
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.totalIncome += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
          acc.balance -= curr.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  // Aggregate data for Chart - grouping by month/date simplified
  const cashFlowData = useMemo(() => {
    // Sort transactions by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    return sorted.map(tx => {
      if (tx.type === 'income') currentBalance += tx.amount;
      else currentBalance -= tx.amount;
      return {
        date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Balance: currentBalance,
        Income: tx.type === 'income' ? tx.amount : 0,
        Expense: tx.type === 'expense' ? tx.amount : 0,
      };
    });
  }, [transactions]);

  // Get last 4-5 transactions
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [transactions]);

  // Spending categories for small bar chart
  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const categoryMap = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4); // Top 4
  }, [transactions]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

  const calcPercentage = (val: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((val / total) * 100);
  };

  return (
    <div className="dashboard-prof">
      <header className="dash-header">
        <div>
          <h1 className="dash-title">Financial Overview</h1>
          <p className="dash-subtitle">Here's a summary of your personal finances today.</p>
        </div>
        <div className="dash-actions">
          <button className="btn btn-primary shadow-sm">
            <ArrowDownRight size={16} /> Download Report
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Balance</span>
            <div className="kpi-icon-wrapper primary-fade">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">${balance.toLocaleString()}</h2>
            <div className="kpi-indicator positive">
              <TrendingUp size={14} /> <span>+2.5% from last month</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Income</span>
            <div className="kpi-icon-wrapper success-fade">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">${totalIncome.toLocaleString()}</h2>
            <div className="kpi-indicator positive">
              <TrendingUp size={14} /> <span>+11% from last month</span>
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Expenses</span>
            <div className="kpi-icon-wrapper danger-fade">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div className="kpi-body">
            <h2 className="kpi-value">${totalExpense.toLocaleString()}</h2>
            <div className="kpi-indicator negative">
              <TrendingDown size={14} /> <span>-4% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="dashboard-grid">
        
        {/* Left Column: Cash Flow Trend */}
        <div className="grid-cell span-2 card-prof">
          <div className="card-prof-header">
            <h3>Cash Flow & Balance Trend</h3>
          </div>
          <div className="chart-wrapper">
            {cashFlowData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" name="Wallet Balance" dataKey="Balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">Add transactions to see your balance trend</div>
            )}
          </div>
        </div>

        {/* Right Column: Top Expenses & Recent */}
        <div className="grid-cell span-1 flex-col-gap">
          <div className="card-prof top-expenses">
            <div className="card-prof-header">
              <h3>Top Spending</h3>
            </div>
            <div className="top-expenses-list mt-4">
              {expensesByCategory.length > 0 ? expensesByCategory.map((expense, idx) => (
                <div key={idx} className="expense-row">
                  <div className="expense-info">
                    <div className="expense-dot" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="expense-name">{expense.name}</span>
                  </div>
                  <div className="expense-stats">
                    <span className="expense-amount">${expense.value.toLocaleString()}</span>
                    <span className="expense-pct">{calcPercentage(expense.value, totalExpense)}%</span>
                  </div>
                  <div className="expense-bar-bg">
                    <div className="expense-bar-fill" style={{ width: `${calcPercentage(expense.value, totalExpense)}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  </div>
                </div>
              )) : (
                <div className="empty-chart">No spending data</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Full Width: Recent Transactions */}
        <div className="grid-cell span-3 card-prof">
          <div className="card-prof-header">
            <h3>Recent Transactions</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="table-wrapper mt-2">
            {recentTransactions.length > 0 ? (
              <table className="prof-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th className="align-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td>
                        <div className="tx-cell-name">
                          <div className={`tx-icon ${tx.type}`}>
                            {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          </div>
                          <span className="tx-desc">{tx.description || tx.category}</span>
                        </div>
                      </td>
                      <td className="text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                      <td>
                        <span className="prof-badge">{tx.category}</span>
                      </td>
                      <td className={`align-right tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-chart padding-large">No recent transactions available</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
