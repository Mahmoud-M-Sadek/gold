import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Customer } from '../types';
import { Plus, Search, Edit2, Phone, MapPin, User, FileText, X } from 'lucide-react';

const Customers = () => {
  const { customers, addCustomer, sales } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // History Modal State
  const [viewHistoryCustomer, setViewHistoryCustomer] = useState<Customer | null>(null);

  const initialFormState: Customer = {
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    totalPurchases: 0,
  };

  const [formData, setFormData] = useState<Customer>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({ ...formData, id: crypto.randomUUID() });
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || c.phone.includes(searchTerm)
  );

  const getCustomerSales = (customerId: string) => {
      return sales.filter(s => s.customerId === customerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">العملاء</h2>
            <p className="text-slate-500 text-sm mt-1">إدارة بيانات العملاء وسجل مشترياتهم</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>إضافة عميل</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{customer.name}</h3>
                            <p className="text-xs text-slate-500">عميل منذ {new Date().getFullYear()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setViewHistoryCustomer(customer)}
                            className="text-slate-400 hover:text-amber-600 p-1"
                            title="سجل المشتريات"
                        >
                            <FileText size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-blue-600 p-1" title="تعديل">
                            <Edit2 size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Phone size={16} className="text-amber-500" />
                        <span>{customer.phone}</span>
                    </div>
                    {customer.address && (
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin size={16} className="text-amber-500" />
                            <span>{customer.address}</span>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">إجمالي المشتريات</p>
                        <p className="font-bold text-slate-800">{customer.totalPurchases.toLocaleString()} ج.م</p>
                    </div>
                    <div className="text-right">
                         <p className="text-xs text-slate-400 mb-1">عدد الفواتير</p>
                         <p className="font-bold text-slate-800">{sales.filter(s => s.customerId === customer.id).length}</p>
                    </div>
                </div>
            </div>
        ))}
        
        {filteredCustomers.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                <User size={48} className="mb-4 opacity-20" />
                <p>لا يوجد عملاء مطابقين للبحث</p>
            </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">إضافة عميل جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الاسم بالكامل <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف <span className="text-red-500">*</span></label>
                    <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ملاحظات</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                ></textarea>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-bold"
                >
                  حفظ العميل
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {viewHistoryCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">سجل مشتريات العميل</h3>
                        <p className="text-slate-500 text-sm">{viewHistoryCustomer.name}</p>
                    </div>
                    <button onClick={() => setViewHistoryCustomer(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {getCustomerSales(viewHistoryCustomer.id).length > 0 ? (
                        <div className="space-y-4">
                            {getCustomerSales(viewHistoryCustomer.id).map(sale => (
                                <div key={sale.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <p className="font-bold text-slate-800">فاتورة #{sale.id.slice(0, 8)}</p>
                                            <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleString('ar-EG')}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-amber-600 text-lg">{sale.total.toLocaleString()} ج.م</p>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">مدفوع</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 pt-3">
                                        <p className="text-xs font-bold text-slate-500 mb-2">الأصناف:</p>
                                        <ul className="space-y-1">
                                            {sale.items.map((item, idx) => (
                                                <li key={idx} className="text-sm flex justify-between text-slate-700">
                                                    <span>{item.name} ({item.weight}g / {item.karat}K)</span>
                                                    <span>{item.totalPrice.toLocaleString()} ج.م</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <FileText size={48} className="mx-auto mb-3 opacity-20" />
                            <p>لا يوجد سجل مشتريات لهذا العميل</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Customers;