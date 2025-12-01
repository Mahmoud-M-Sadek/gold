import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User } from '../types';

const Login = () => {
  const { login } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated Backend Logic
    if (username === 'admin' && password === '1234') {
        const adminUser: User = { id: '1', name: 'المدير العام', role: 'admin', username: 'admin' };
        login(adminUser);
    } else if (username === 'user' && password === '1234') {
        const staffUser: User = { id: '2', name: 'بائع', role: 'staff', username: 'user' };
        login(staffUser);
    } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-amber-500 p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">الذهب الذكي</h1>
            <p className="text-amber-900/70 font-medium">نظام إدارة المحلات</p>
        </div>
        <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">تسجيل الدخول</h2>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">اسم المستخدم</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="admin"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">كلمة المرور</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="****"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                >
                    دخول
                </button>
            </form>
            <div className="mt-6 text-center text-xs text-slate-400">
                <p>للنسخة التجريبية استخدم:</p>
                <p>المستخدم: admin | المرور: 1234</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;