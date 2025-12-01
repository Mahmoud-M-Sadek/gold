import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Sidebar = () => {
  const { logout, user } = useStore();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { to: '/pos', icon: ShoppingCart, label: 'نقطة البيع (POS)' },
    { to: '/inventory', icon: Package, label: 'المخزون والمنتجات' },
    { to: '/customers', icon: Users, label: 'العملاء' },
    { to: '/suppliers', icon: Truck, label: 'الموردين' },
    { to: '/reports', icon: TrendingUp, label: 'التقارير' },
    { to: '/settings', icon: Settings, label: 'الإعدادات والأسعار' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed right-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-700 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-amber-500 tracking-wider">الذهب الذكي</h1>
          <p className="text-xs text-slate-400 mt-1">نظام إدارة المحلات</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700 bg-slate-950">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-900 font-bold">
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.role === 'admin' ? 'مدير النظام' : 'موظف'}</p>
                </div>
            </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default Sidebar;