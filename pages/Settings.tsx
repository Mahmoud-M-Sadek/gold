import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { KaratType } from '../types';
import { Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { goldPrices, updateGoldPrice, user } = useStore();
  const [localPrices, setLocalPrices] = useState(goldPrices);

  const handlePriceChange = (karat: KaratType, val: string) => {
    const newPrice = parseFloat(val);
    if (!isNaN(newPrice)) {
      setLocalPrices(prev => prev.map(p => p.karat === karat ? { ...p, price: newPrice } : p));
    }
  };

  const savePrices = () => {
    localPrices.forEach(p => {
      updateGoldPrice(p.karat, p.price);
    });
    alert('تم تحديث الأسعار بنجاح');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">الإعدادات</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <RefreshCw size={20} className="text-amber-500" />
                    أسعار الذهب اليومية
                </h3>
                <p className="text-sm text-slate-500">تحديث أسعار الذهب (لكل جرام) والتي يتم بناءً عليها حساب أسعار البيع.</p>
            </div>
            <button 
                onClick={savePrices}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700"
            >
                <Save size={18} />
                حفظ الأسعار
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {localPrices.map((item) => (
            <div key={item.karat} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">عيار {item.karat}</label>
              <div className="relative">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handlePriceChange(item.karat, e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg font-bold text-lg text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">ج.م</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                آخر تحديث: {new Date(item.lastUpdated).toLocaleDateString('ar-EG')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">نسخ احتياطي للبيانات</h3>
          <p className="text-sm text-slate-500 mb-4">تنزيل نسخة من قاعدة البيانات المحلية كملف JSON.</p>
          <button 
            onClick={() => {
                const data = JSON.stringify(localStorage);
                const blob = new Blob([data], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                link.href = url;
                link.click();
            }}
            className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            تنزيل النسخة الاحتياطية
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;