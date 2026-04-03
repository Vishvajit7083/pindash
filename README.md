# FinDash: Personal Financial Dashboard

FinDash is a simple, modern, and intuitive web application designed to help users track and understand their financial activity. This project demonstrates responsive layout construction, data visualization, basic state management, and an aesthetically pleasing design system.

## Setup Instructions

1. **Install Dependencies**
   Navigate to the project root and install the necessary dependencies using npm:
   ```bash
   npm install
   ```

2. **Run the Development Server**
   Start the application locally:
   ```bash
   npm run dev
   ```
   *The application will typically be accessible at `http://localhost:5173`.*

3. **Build for Production**
   If you wish to create a production-ready build:
   ```bash
   npm run build
   ```

## Overview of Approach

The development of this project was centered around building a strong, modular foundation using React and TypeScript via Vite. Given the requirements for a "premium" design that avoids default Tailwind styling, a custom Vanilla CSS design system was built from scratch using CSS variables. 

### Key Technical Decisions:
- **React Context for State Management**: Since the application state is relatively simple (transactions array, role string, and theme toggle), `React Context` provides a lightweight, built-in solution without the overhead of external libraries like Redux or Zustand.
- **Recharts for Visualization**: Recharts provides robust, responsive component-based SVGs ideal for dynamic, interactive financial dashboards.
- **Vite & React (TypeScript)**: Chose Vite for rapid scaffolding and superior HMR performance, with TypeScript for type safety, self-documenting code, and overall higher code quality.
- **Vanilla CSS (Variables + Glassmorphism)**: Created scalable design tokens in `index.css` supporting light and dark mode toggling seamlessly. The layout is optimized using CSS grid, flexbox and media queries.

## Features Explained

### 1. Dashboard Overview
- Summary cards display total balance, income, and expenses globally using an aggregated state.
- Features dynamic time-based Area Chart mapping the user's cash-flow dynamically mapped over consecutive transaction dates.
- Features a categorical Pie Chart breaking down strictly expense-based allocations.

### 2. Transactions Section
- Users can view a tabular list of their transaction history sorted by date.
- Real-time searching acts on both categories and note-based descriptions.
- Filtering allows selecting "All", "Income", or "Expense".

### 3. Role-Based UI (Simulation)
- In the sidebar layout, an interactive mock role switcher allows the user to pivot between `Viewer` and `Admin`.
- **Viewer**: Read-only access to all dashboards and data.
- **Admin**: Gains the UI capability to add new transactions via modal, and a "Delete" button inside the transactions table.

### 4. Dynamic Financial Insights
- The "Insights" tab uses an AI-simulated derivation logic checking current transaction arrays to extract useful observations.
- Offers color-coded flags: top spending categories, savings rate metrics (Green for > 20%, Neutral for positive, Red for negative cash flow), and recent activity checks.

### 5. Extra Features implemented
- **Dark Mode Configuration**: Completely themed across variables, toggleable from the sidebar header.
- **Local Storage Persistence**: Real-time hydration and stringified saving to the client's `localStorage` prevents data loss across manual page reloads.
- **Micro-Animations**: Uses subtle CSS transitions around hovering glass-panels, routing toggles, and state interactions for a dynamic workflow.
