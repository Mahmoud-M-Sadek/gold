import React, { PropsWithChildren } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
    const { user } = useStore();
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 mr-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

const AppRoutes = () => {
    const { user } = useStore();
    
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
            <Route path="/pos" element={<ProtectedLayout><POS /></ProtectedLayout>} />
            <Route path="/customers" element={<ProtectedLayout><Customers /></ProtectedLayout>} />
            <Route path="/suppliers" element={<ProtectedLayout><Suppliers /></ProtectedLayout>} />
            <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
            <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        </Routes>
    );
}

const App = () => {
  return (
    <StoreProvider>
        <HashRouter>
            <AppRoutes />
        </HashRouter>
    </StoreProvider>
  );
};

export default App;