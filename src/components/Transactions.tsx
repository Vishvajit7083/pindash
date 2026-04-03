import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './Transactions.css';

const Transactions: React.FC = () => {
  const { transactions, role, deleteTransaction, addTransaction } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New transaction form state
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    description: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || tx.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.category || !newTx.date) return;
    
    addTransaction({
      date: newTx.date,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      description: newTx.description
    });
    
    setIsModalOpen(false);
    setNewTx({ ...newTx, amount: '', category: '', description: '' });
  };

  return (
    <div className="transactions-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="text-muted">View and manage your financial activity.</p>
        </div>
        
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        )}
      </header>

      <div className="controls-bar glass-panel">
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search category or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>
      </div>

      <div className="transactions-list glass-panel">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state p-6 text-center">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  {role === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>
                      <span className="badge">
                        {tx.category}
                      </span>
                    </td>
                    <td className="text-muted">{tx.description || '-'}</td>
                    <td>
                      <div className={`amount ${tx.type}`}>
                        {tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        ${tx.amount.toLocaleString()}
                      </div>
                    </td>
                    {role === 'admin' && (
                      <td>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => deleteTransaction(tx.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-panel">
            <div className="modal-header">
              <h3>Add New Transaction</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label>Type</label>
                <select 
                  value={newTx.type} 
                  onChange={(e) => setNewTx({...newTx, type: e.target.value as any})}
                  className="form-control"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  value={newTx.date}
                  onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required 
                  placeholder="0.00"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Groceries, Salary..."
                  value={newTx.category}
                  onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Notes..."
                  value={newTx.description}
                  onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
