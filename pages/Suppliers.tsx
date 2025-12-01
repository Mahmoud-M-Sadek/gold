import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Supplier, SupplyTransaction } from '../types';
import { Plus, Search, Truck, Phone, Mail, MapPin, History, PackagePlus, X } from 'lucide-react';

const Suppliers = () => {
  const { suppliers, addSupplier, products, addSupplyTransaction, supplyTransactions } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Transaction States
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [modalType, setModalType] = useState<'supply' | 'history' | null>(null);

  // New Supply Form State
  const [supplyForm, setSupplyForm] = useState({
      productId: '',
      quantity: 1,
      totalCost: 0
  });

  const initialFormState: Supplier = {
    id: '',
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    itemsSupplied: 0,
  };

  const [formData, setFormData] = useState<Supplier>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({ ...formData, id: crypto.randomUUID() });
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleSupplySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeSupplier || !supplyForm.productId) return;

      const product = products.find(p => p.id === supplyForm.productId);
      if (!product) return;

      const transaction: SupplyTransaction = {
          id: crypto.randomUUID(),
          supplierId: activeSupplier.id,
          supplierName: activeSupplier.name,
          productId: product.id,
          productName: product.name,
          quantity: Number(supplyForm.quantity),
          totalCost: Number(supplyForm.totalCost),
          date: new Date().toISOString()
      };

      addSupplyTransaction(transaction);
      setModalType(null);
      setActiveSupplier(null);
      setSupplyForm({ productId: '', quantity: 1, totalCost: 0 });
  };

  const openSupplyModal = (supplier: Supplier) => {
      setActiveSupplier(supplier);
      setModalType('supply');
  };

  const openHistoryModal = (supplier: Supplier) => {
      setActiveSupplier(supplier);
      setModalType('history');
  };

  const closeModals = () => {
      setModalType(null);
      setActiveSupplier(null);
      setSupplyForm({ productId: '', quantity: 1, totalCost: 0 });
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.includes(searchTerm) || s.contactPerson.includes(searchTerm)
  );

  const supplierHistory = activeSupplier 
      ? supplyTransactions.filter(t => t.supplierId === activeSupplier.id)
      : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">الموردين</h2>
            <p className="text-slate-500 text-sm mt-1">قائمة موردي الذهب والمجوهرات</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>إضافة مورد</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="بحث عن مورد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-l border-slate-100 min-w-[150px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm mb-3">
                        <Truck size={32} />
                    </div>
                    <h3 className="font-bold text-center text-slate-800">{supplier.name}</h3>
                    <p className="text-xs text-slate-500 text-center mt-1">{supplier.contactPerson}</p>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Phone size={18} className="text-amber-500" />
                            <span className="font-medium dir-ltr">{supplier.phone}</span>
                        </div>
                        {supplier.address && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin size={18} className="text-amber-500" />
                                <span>{supplier.address}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm pt-2">
                             <span className="text-slate-400">مرات التوريد:</span>
                             <span className="font-bold text-slate-800">{supplier.itemsSupplied}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => openSupplyModal(supplier)}
                            className="flex-1 bg-amber-50 text-amber-700 py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-amber-100 font-medium"
                        >
                            <PackagePlus size={16} />
                            توريد جديد
                        </button>
                        <button 
                            onClick={() => openHistoryModal(supplier)}
                            className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-slate-100 font-medium"
                        >
                            <History size={16} />
                            السجل
                        </button>
                    </div>
                </div>
            </div>
        ))}

        {filteredSuppliers.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                <Truck size={48} className="mb-4 opacity-20" />
                <p>لا يوجد موردين مسجلين</p>
            </div>
        )}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">إضافة مورد جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم الشركة/المورد <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الشخص المسؤول</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
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

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-bold"
                >
                  حفظ المورد
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

      {/* Supply Transaction Modal */}
      {modalType === 'supply' && activeSupplier && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
             <div className="bg-white rounded-xl w-full max-w-lg">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">تسجيل توريد جديد</h3>
                    <p className="text-sm text-slate-500">المورد: {activeSupplier.name}</p>
                 </div>
                 <button onClick={closeModals} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
               </div>
               <form onSubmit={handleSupplySubmit} className="p-6 space-y-4">
                 <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                     سيتم إضافة الكمية المدخلة إلى المخزون الحالي للمنتج المحدد تلقائياً.
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">المنتج <span className="text-red-500">*</span></label>
                   <select
                     required
                     value={supplyForm.productId}
                     onChange={e => setSupplyForm({ ...supplyForm, productId: e.target.value })}
                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                   >
                     <option value="">اختر المنتج...</option>
                     {products.map(p => (
                         <option key={p.id} value={p.id}>{p.name} ({p.karat}K - {p.weight}g)</option>
                     ))}
                   </select>
                   <p className="text-xs text-slate-400 mt-1">يجب إضافة المنتج في صفحة المخزون أولاً ليظهر هنا</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">الكمية الواردة <span className="text-red-500">*</span></label>
                        <input
                            required
                            type="number"
                            min="1"
                            value={supplyForm.quantity}
                            onChange={e => setSupplyForm({ ...supplyForm, quantity: Number(e.target.value) })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">التكلفة الإجمالية</label>
                        <input
                            required
                            type="number"
                            min="0"
                            value={supplyForm.totalCost}
                            onChange={e => setSupplyForm({ ...supplyForm, totalCost: Number(e.target.value) })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                     </div>
                 </div>

                 <div className="flex gap-3 mt-6">
                   <button
                     type="submit"
                     className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-bold"
                   >
                     تسجيل وإضافة للمخزون
                   </button>
                 </div>
               </form>
             </div>
           </div>
      )}

      {/* History Modal */}
      {modalType === 'history' && activeSupplier && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
             <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800">سجل التوريدات</h3>
                    <p className="text-sm text-slate-500">المورد: {activeSupplier.name}</p>
                 </div>
                 <button onClick={closeModals} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
               </div>
               <div className="p-6 overflow-y-auto">
                 {supplierHistory.length > 0 ? (
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 text-slate-600 text-sm">
                            <tr>
                                <th className="p-3">التاريخ</th>
                                <th className="p-3">المنتج</th>
                                <th className="p-3">الكمية</th>
                                <th className="p-3">التكلفة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {supplierHistory.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="p-3 text-sm text-slate-600">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="p-3 font-medium text-slate-800">{t.productName}</td>
                                    <td className="p-3 font-bold text-green-600">+{t.quantity}</td>
                                    <td className="p-3 text-slate-600">{t.totalCost.toLocaleString()} ج.م</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <div className="text-center py-10 text-slate-400">
                        <History size={48} className="mx-auto mb-3 opacity-20" />
                        <p>لا يوجد سجل توريدات لهذا المورد</p>
                    </div>
                 )}
               </div>
             </div>
           </div>
      )}
    </div>
  );
};

export default Suppliers;