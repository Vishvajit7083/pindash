import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description?: string;
}

export type Role = 'viewer' | 'admin';

interface AppContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultTransactions: Transaction[] = [
  { id: '1', date: '2023-10-01', amount: 5000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '2', date: '2023-10-05', amount: 120, category: 'Groceries', type: 'expense', description: 'Supermarket' },
  { id: '3', date: '2023-10-10', amount: 60, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: '4', date: '2023-10-12', amount: 800, category: 'Freelance', type: 'income', description: 'Web dev project' },
  { id: '5', date: '2023-10-15', amount: 150, category: 'Utilities', type: 'expense', description: 'Electricity & Water' },
  { id: '6', date: '2023-10-20', amount: 200, category: 'Shopping', type: 'expense', description: 'Clothes' },
  { id: '7', date: '2023-10-25', amount: 50, category: 'Groceries', type: 'expense', description: 'Local market' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('financial_txs');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });
  
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('financial_role') as Role) || 'viewer';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('financial_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('financial_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financial_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('financial_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ transactions, role, setRole, addTransaction, deleteTransaction, isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
