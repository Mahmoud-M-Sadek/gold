import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { DollarSign, Package, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import { analyzeSalesTrends } from '../services/geminiService';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const { sales, products, goldPrices } = useStore();
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalItemsSold = sales.reduce((acc, sale) => acc + sale.items.length, 0);
  const lowStockItems = products.filter(p => p.quantity < 3).length;
  const inventoryValue = products.reduce((acc, p) => {
    // Estimate value based on current gold price
    const price = goldPrices.find(gp => gp.karat === p.karat)?.price || 3000;
    return acc + (p.weight * price * p.quantity);
  }, 0);

  // Prepare chart data (Last 7 sales)
  const salesData = sales.slice(0, 7).map((s, i) => ({
    name: `فاتورة ${i+1}`,
    amount: s.total
  })).reverse();

  const handleAIAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzeSalesTrends(sales);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">نظرة عامة</h2>
        <div className="text-sm text-slate-500">
          تاريخ اليوم: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي المبيعات" 
          value={`${totalRevenue.toLocaleString()} ج.م`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="قيمة المخزون (تقريبي)" 
          value={`${inventoryValue.toLocaleString()} ج.م`} 
          icon={Package} 
          color="bg-amber-500" 
          subtext="بناءً على سعر الذهب الحالي"
        />
        <StatCard 
          title="عدد عمليات البيع" 
          value={sales.length} 
          icon={ShoppingBag} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="تنبيهات المخزون" 
          value={lowStockItems} 
          icon={AlertTriangle} 
          color="bg-red-500" 
          subtext="منتجات قاربت على النفاد"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">تحليل المبيعات الأخيرة</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ textAlign: 'right', borderRadius: '8px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="amount" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">المساعد الذكي</h3>
            <button 
                onClick={handleAIAnalysis}
                disabled={loadingAi || sales.length === 0}
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 disabled:opacity-50"
            >
                {loadingAi ? 'جاري التحليل...' : 'تحليل الأداء'}
            </button>
          </div>
          <div className="bg-indigo-50/50 rounded-lg p-4 min-h-[200px]">
             {aiAnalysis ? (
                 <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                     {aiAnalysis}
                 </div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm text-center">
                     <TrendingUp className="mb-2 opacity-50" size={32} />
                     <p>اضغط على "تحليل الأداء" للحصول على رؤى ذكية حول مبيعاتك ومخزونك باستخدام الذكاء الاصطناعي.</p>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;