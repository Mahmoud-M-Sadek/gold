import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CartItem, Product, Sale } from '../types';
import { Search, Plus, Trash2, Printer, UserPlus, CheckCircle } from 'lucide-react';

const POS = () => {
  const { products, goldPrices, customers, addSale, addCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [showInvoice, setShowInvoice] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  // New Customer State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // Calculate Price for a product based on today's rates
  const calculateItemPrice = (product: Product) => {
    const goldRate = goldPrices.find(p => p.karat === product.karat)?.price || 0;
    const goldValue = goldRate * product.weight;
    const makingCharges = product.makingChargePerGram * product.weight;
    return Math.ceil(goldValue + makingCharges);
  };

  const filteredProducts = products.filter(p => 
    (p.name.includes(searchTerm) || p.id.includes(searchTerm)) && p.quantity > 0
  );

  const addToCart = (product: Product) => {
    const price = calculateItemPrice(product);
    const existing = cart.find(item => item.id === product.id);
    
    // For unique jewelry pieces, usually quantity is 1, but let's handle multiples if needed
    if (existing) {
      if (existing.quantity >= product.quantity) return; // Stock limit
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, totalPrice: price * (item.quantity + 1) } 
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        salesPricePerGram: goldPrices.find(g => g.karat === product.karat)?.price || 0,
        totalPrice: price 
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const sale: Sale = {
      id: crypto.randomUUID(),
      customerId: selectedCustomerId || null,
      customerName: customers.find(c => c.id === selectedCustomerId)?.name || 'عميل نقدي',
      items: cart,
      subtotal: cartTotal,
      discount: 0,
      tax: 0, // Simplified for now
      total: cartTotal,
      date: new Date().toISOString(),
      paymentMethod: 'cash'
    };

    addSale(sale);
    setLastSale(sale);
    setShowInvoice(true);
    setCart([]);
    setSelectedCustomerId('');
  };

  const handleQuickAddCustomer = () => {
      if(!newCustomerName) return;
      const newCust = {
          id: crypto.randomUUID(),
          name: newCustomerName,
          phone: newCustomerPhone,
          totalPurchases: 0
      };
      addCustomer(newCust);
      setSelectedCustomerId(newCust.id);
      setNewCustomerName('');
      setNewCustomerPhone('');
  };

  if (showInvoice && lastSale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto mt-10 text-center">
        <div className="mb-6">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">تمت العملية بنجاح</h2>
        </div>
        
        <div className="w-full bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 text-right">
            <div className="flex justify-between mb-4 border-b pb-2">
                <span className="font-bold">رقم الفاتورة:</span>
                <span>{lastSale.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
                <span className="font-bold">التاريخ:</span>
                <span>{new Date(lastSale.date).toLocaleString('ar-EG')}</span>
            </div>
            <div className="flex justify-between mb-4 border-b pb-2">
                <span className="font-bold">العميل:</span>
                <span>{lastSale.customerName}</span>
            </div>
            <div className="space-y-2">
                {lastSale.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} ({item.weight}g / {item.karat}K)</span>
                        <span>{item.totalPrice.toLocaleString()} ج.م</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-300 flex justify-between text-xl font-bold text-amber-600">
                <span>الإجمالي:</span>
                <span>{lastSale.total.toLocaleString()} ج.م</span>
            </div>
        </div>

        <div className="flex gap-4">
            <button 
                onClick={() => window.print()} 
                className="bg-slate-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900"
            >
                <Printer size={18} /> طباعة
            </button>
            <button 
                onClick={() => setShowInvoice(false)} 
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
            >
                بيع جديد
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Left: Product List */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                    const price = calculateItemPrice(product);
                    return (
                        <div 
                            key={product.id} 
                            onClick={() => addToCart(product)}
                            className="border border-slate-100 rounded-lg p-4 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all group"
                        >
                            <div className="h-24 bg-slate-50 rounded-md mb-3 flex items-center justify-center text-amber-200">
                                <span className="text-4xl">💎</span>
                            </div>
                            <h3 className="font-bold text-slate-800 truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                                <span>{product.karat}K</span>
                                <span>{product.weight} جرام</span>
                            </div>
                            <div className="mt-2 text-amber-600 font-bold text-lg">
                                {price.toLocaleString()} ج.م
                            </div>
                        </div>
                    );
                })}
                {filteredProducts.length === 0 && (
                     <div className="col-span-3 text-center py-10 text-slate-400">لا توجد منتجات</div>
                )}
            </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <h3 className="font-bold text-lg text-slate-800 mb-4">بيانات العميل</h3>
            <div className="flex gap-2 mb-2">
                <select 
                    value={selectedCustomerId} 
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-sm"
                >
                    <option value="">عميل نقدي (عام)</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            {/* Quick Add Customer */}
            <div className="mt-2 p-2 border border-dashed border-slate-300 rounded-lg">
                <p className="text-xs text-slate-500 mb-2 font-bold">عميل جديد؟</p>
                <div className="flex gap-2">
                    <input 
                        placeholder="الاسم" 
                        className="w-1/2 p-1 text-sm border rounded"
                        value={newCustomerName}
                        onChange={e => setNewCustomerName(e.target.value)}
                    />
                    <input 
                        placeholder="الهاتف" 
                        className="w-1/2 p-1 text-sm border rounded"
                        value={newCustomerPhone}
                        onChange={e => setNewCustomerPhone(e.target.value)}
                    />
                    <button onClick={handleQuickAddCustomer} className="bg-amber-100 text-amber-600 p-1 rounded hover:bg-amber-200">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBagIcon />
                    <p className="mt-2">السلة فارغة</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                            <p className="text-xs text-slate-500">{item.weight}g | {item.karat}K</p>
                            <p className="text-amber-600 font-bold text-sm mt-1">{item.totalPrice.toLocaleString()} ج.م</p>
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-600 p-2"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
            <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">الإجمالي</span>
                <span className="text-2xl font-bold text-slate-900">{cartTotal.toLocaleString()} ج.م</span>
            </div>
            <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
                إتمام البيع
            </button>
        </div>
      </div>
    </div>
  );
};

const ShoppingBagIcon = () => (
    <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
);

export default POS;