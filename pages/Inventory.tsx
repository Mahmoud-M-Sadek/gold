import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, KaratType } from '../types';
import { Plus, Search, Edit2, Trash2, Wand2 } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const initialFormState: Product = {
    id: '',
    name: '',
    category: '',
    karat: KaratType.K21,
    weight: 0,
    quantity: 1,
    makingChargePerGram: 0,
    description: '',
  };

  const [formData, setFormData] = useState<Product>(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct({ ...formData, id: editingId });
    } else {
      addProduct({ ...formData, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleGenerateDesc = async () => {
    setIsGenerating(true);
    const desc = await generateProductDescription(formData);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || p.category.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">إدارة المخزون</h2>
        <button
          onClick={() => {
            setFormData(initialFormState);
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="بحث عن منتج بالاسم أو التصنيف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="p-4">اسم المنتج</th>
              <th className="p-4">العيار</th>
              <th className="p-4">الوزن (جرام)</th>
              <th className="p-4">المصنعية/جرام</th>
              <th className="p-4">الكمية</th>
              <th className="p-4">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{product.name}</td>
                <td className="p-4">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">
                    {product.karat}K
                  </span>
                </td>
                <td className="p-4">{product.weight}</td>
                <td className="p-4">{product.makingChargePerGram} ج.م</td>
                <td className="p-4">
                    <span className={`${product.quantity < 3 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {product.quantity}
                    </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">لا توجد منتجات مطابقة</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingId ? 'تعديل منتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
                  <input
                    type="text"
                    list="categories"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <datalist id="categories">
                      <option value="خواتم" />
                      <option value="أساور" />
                      <option value="سلاسل" />
                      <option value="أقراط" />
                      <option value="أطقم كاملة" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">العيار</label>
                  <select
                    value={formData.karat}
                    onChange={e => setFormData({ ...formData, karat: e.target.value as KaratType })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {Object.values(KaratType).map(k => (
                      <option key={k} value={k}>{k}K</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الوزن (جرام)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">المصنعية (ج.م/جرام)</label>
                  <input
                    required
                    type="number"
                    value={formData.makingChargePerGram}
                    onChange={e => setFormData({ ...formData, makingChargePerGram: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الكمية</label>
                  <input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">الوصف</label>
                    <button 
                        type="button" 
                        onClick={handleGenerateDesc}
                        disabled={isGenerating || !formData.name}
                        className="text-xs flex items-center gap-1 text-amber-600 hover:text-amber-700 disabled:opacity-50"
                    >
                        <Wand2 size={12} />
                        توليد وصف بالذكاء الاصطناعي
                    </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder={isGenerating ? "جاري التوليد..." : "وصف المنتج..."}
                ></textarea>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  حفظ
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
    </div>
  );
};

export default Inventory;