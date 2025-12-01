import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { FileText, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';

const COLORS = ['#d97706', '#0f172a', '#64748b', '#cbd5e1', '#ef4444'];

const Reports = () => {
  const { sales, products } = useStore();
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');

  // --- Calculations for Sales Report ---
  // Group sales by date (Last 7 days logic simulated)
  const salesByDate = sales.reduce((acc: any, sale) => {
    const date = new Date(sale.date).toLocaleDateString('ar-EG');
    acc[date] = (acc[date] || 0) + sale.total;
    return acc;
  }, {});

  const salesChartData = Object.keys(salesByDate).map(date => ({
    date,
    amount: salesByDate[date]
  }));

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const averageSaleValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  // --- Calculations for Inventory Report ---
  // Distribution by Karat
  const inventoryByKarat = products.reduce((acc: any, product) => {
    acc[product.karat] = (acc[product.karat] || 0) + product.quantity;
    return acc;
  }, {});

  const inventoryChartData = Object.keys(inventoryByKarat).map(karat => ({
    name: `عيار ${karat}`,
    value: inventoryByKarat[karat]
  }));

  const totalStockItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalWeight = products.reduce((acc, p) => acc + (p.weight * p.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">التقارير والتحليلات</h2>
            <p className="text-slate-500 text-sm mt-1">متابعة دقيقة لأداء المحل والمخزون</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200">
            <button 
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                تقرير المبيعات
            </button>
            <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                تقرير المخزون
            </button>
        </div>
      </div>

      {activeTab === 'sales' && (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">إجمالي الإيرادات</p>
                            <h3 className="text-2xl font-bold text-slate-800">{totalRevenue.toLocaleString()} ج.م</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">عدد الفواتير</p>
                            <h3 className="text-2xl font-bold text-slate-800">{sales.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">متوسط قيمة الفاتورة</p>
                            <h3 className="text-2xl font-bold text-slate-800">{Math.round(averageSaleValue).toLocaleString()} ج.م</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">نمو المبيعات (آخر فترة)</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesChartData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip contentStyle={{ textAlign: 'right', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="amount" stroke="#d97706" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">أحدث التعاملات</h3>
                </div>
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-4 font-medium">رقم الفاتورة</th>
                            <th className="p-4 font-medium">العميل</th>
                            <th className="p-4 font-medium">التاريخ</th>
                            <th className="p-4 font-medium">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sales.slice(0, 5).map(sale => (
                            <tr key={sale.id} className="hover:bg-slate-50">
                                <td className="p-4 font-mono text-sm text-slate-500">{sale.id.slice(0, 8)}</td>
                                <td className="p-4 text-slate-800">{sale.customerName}</td>
                                <td className="p-4 text-slate-600">{new Date(sale.date).toLocaleDateString('ar-EG')}</td>
                                <td className="p-4 font-bold text-amber-600">{sale.total.toLocaleString()} ج.م</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Inventory Distribution Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">توزيع المخزون حسب العيار</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {inventoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm mb-1">إجمالي القطع في المخزون</p>
                            <h3 className="text-3xl font-bold text-slate-800">{totalStockItems}</h3>
                        </div>
                        <div className="p-4 bg-amber-100 text-amber-600 rounded-full">
                            <Package size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm mb-1">إجمالي الوزن (جرام)</p>
                            <h3 className="text-3xl font-bold text-slate-800">{totalWeight.toFixed(2)}</h3>
                        </div>
                        <div className="p-4 bg-slate-100 text-slate-600 rounded-full">
                            <span className="font-bold text-xl">g</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Low Stock Warning */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <h3 className="text-lg font-bold text-slate-800">تنبيهات انخفاض المخزون</h3>
                </div>
                <div className="p-6">
                    {products.filter(p => p.quantity < 3).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.filter(p => p.quantity < 3).map(p => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg">
                                    <div>
                                        <p className="font-bold text-slate-800">{p.name}</p>
                                        <p className="text-xs text-red-600">عيار {p.karat} | المتبقي: {p.quantity}</p>
                                    </div>
                                    <button className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50">
                                        طلب
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center">المخزون في حالة جيدة.</p>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Reports;