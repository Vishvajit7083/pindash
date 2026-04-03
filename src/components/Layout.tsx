import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, LayoutDashboard, Receipt, PieChart, Wallet } from 'lucide-react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { role, setRole, isDarkMode, toggleDarkMode } = useAppContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'insights', label: 'Insights', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <div className="logo">
            <Wallet className="logo-icon" size={28} />
            <h2>FinDash</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="settings-group">
            <label className="text-sm text-muted">Role Simulation:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as 'admin' | 'viewer')}
              className="role-selector"
            >
              <option value="viewer">Viewer (Read-only)</option>
              <option value="admin">Admin (Edit)</option>
            </select>
          </div>
          
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="mobile-header glass-panel">
          <div className="logo">
            <Wallet className="logo-icon" size={24} />
            <h2>FinDash</h2>
          </div>
          <button className="icon-btn" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        
        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
