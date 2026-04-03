import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lightbulb, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import './Insights.css';

const Insights: React.FC = () => {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const results = [];
    
    // 1. Highest Spending Category
    const expenses = transactions.filter(tx => tx.type === 'expense');
    if (expenses.length > 0) {
      const categoryMap = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);
      
      const highestCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
      
      results.push({
        id: 'highest-spend',
        title: 'Top Expense Category',
        description: `You have spent the most on ${highestCategory[0]} ($${highestCategory[1].toLocaleString()}).`,
        type: highestCategory[1] > 500 ? 'warning' : 'neutral',
        icon: <AlertCircle size={24} />
      });
    }

    // 2. Income vs Expenses
    const income = transactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + tx.amount, 0);
    const totalExpense = expenses.reduce((acc, tx) => acc + tx.amount, 0);
    
    if (income > 0 && totalExpense > 0) {
      const savingsRate = ((income - totalExpense) / income) * 100;
      
      if (savingsRate > 20) {
        results.push({
          id: 'savings-great',
          title: 'Great Savings Rate!',
          description: `You are saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
          type: 'success',
          icon: <TrendingUp size={24} />
        });
      } else if (savingsRate > 0) {
        results.push({
          id: 'savings-ok',
          title: 'Positive Cash Flow',
          description: `Your income covers your expenses, saving ${savingsRate.toFixed(1)}%.`,
          type: 'neutral',
          icon: <TrendingUp size={24} />
        });
      } else {
        results.push({
          id: 'savings-bad',
          title: 'Negative Cash Flow',
          description: `You are spending more than you earn by $${Math.abs(income - totalExpense).toLocaleString()}.`,
          type: 'danger',
          icon: <TrendingDown size={24} />
        });
      }
    }
    
    // 3. Most Recent Activity
    const recentTx = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    if (recentTx) {
        results.push({
            id: 'recent-activity',
            title: 'Recent Activity',
            description: `Your last transaction was a $${recentTx.amount} ${recentTx.type} on ${recentTx.date}.`,
            type: 'neutral',
            icon: <Clock size={24} />
        });
    }

    return results;
  }, [transactions]);

  return (
    <div className="insights-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Financial Insights</h1>
          <p className="text-muted">AI-powered (simulated) observations about your finances.</p>
        </div>
      </header>

      <div className="insights-grid">
        {insights.length === 0 ? (
          <div className="glass-panel p-6 text-center text-muted">
            <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
            <p>Not enough data to generate insights. Add more transactions!</p>
          </div>
        ) : (
          insights.map(item => (
            <div key={item.id} className={`insight-card glass-panel ${item.type}`}>
              <div className="insight-icon">
                {item.icon}
              </div>
              <div className="insight-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Insights;
