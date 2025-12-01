import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { Product, Customer, Sale, Supplier, GoldPrice, KaratType, User, SupplyTransaction } from '../types';
import { DB } from '../services/db';

interface StoreContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  customers: Customer[];
  addCustomer: (customer: Customer) => void;

  sales: Sale[];
  addSale: (sale: Sale) => void;

  goldPrices: GoldPrice[];
  updateGoldPrice: (karat: KaratType, price: number) => void;

  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;

  supplyTransactions: SupplyTransaction[];
  addSupplyTransaction: (transaction: SupplyTransaction) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: PropsWithChildren) => {
  // State Initialization
  const [user, setUser] = useState<User | null>(DB.get(DB.KEYS.USER, null));
  const [products, setProducts] = useState<Product[]>(DB.get(DB.KEYS.PRODUCTS, []));
  const [customers, setCustomers] = useState<Customer[]>(DB.get(DB.KEYS.CUSTOMERS, []));
  const [sales, setSales] = useState<Sale[]>(DB.get(DB.KEYS.SALES, []));
  const [suppliers, setSuppliers] = useState<Supplier[]>(DB.get(DB.KEYS.SUPPLIERS, []));
  const [supplyTransactions, setSupplyTransactions] = useState<SupplyTransaction[]>(DB.get('thahab_supply_transactions', []));
  
  const defaultPrices: GoldPrice[] = [
    { karat: KaratType.K24, price: 4150, lastUpdated: new Date().toISOString() },
    { karat: KaratType.K22, price: 3800, lastUpdated: new Date().toISOString() },
    { karat: KaratType.K21, price: 3630, lastUpdated: new Date().toISOString() },
    { karat: KaratType.K18, price: 3110, lastUpdated: new Date().toISOString() },
  ];
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>(DB.get(DB.KEYS.PRICES, defaultPrices));

  // Persistence Effects
  useEffect(() => DB.set(DB.KEYS.USER, user), [user]);
  useEffect(() => DB.set(DB.KEYS.PRODUCTS, products), [products]);
  useEffect(() => DB.set(DB.KEYS.CUSTOMERS, customers), [customers]);
  useEffect(() => DB.set(DB.KEYS.SALES, sales), [sales]);
  useEffect(() => DB.set(DB.KEYS.SUPPLIERS, suppliers), [suppliers]);
  useEffect(() => DB.set('thahab_supply_transactions', supplyTransactions), [supplyTransactions]);
  useEffect(() => DB.set(DB.KEYS.PRICES, goldPrices), [goldPrices]);

  // Actions
  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(i => i.id === p.id ? p : i));
  const deleteProduct = (id: string) => setProducts(products.filter(i => i.id !== id));

  const addCustomer = (c: Customer) => setCustomers([...customers, c]);
  
  const addSale = (s: Sale) => {
    setSales([s, ...sales]);
    // Decrease stock
    const updatedProducts = products.map(p => {
      const soldItem = s.items.find(i => i.id === p.id);
      if (soldItem) {
        return { ...p, quantity: p.quantity - soldItem.quantity }; 
      }
      return p;
    });
    setProducts(updatedProducts);
    
    // Update Customer purchase total
    if (s.customerId) {
        setCustomers(prev => prev.map(c => 
            c.id === s.customerId 
            ? { ...c, totalPurchases: c.totalPurchases + s.total } 
            : c
        ));
    }
  };

  const updateGoldPrice = (karat: KaratType, price: number) => {
    setGoldPrices(prev => {
      const exists = prev.find(p => p.karat === karat);
      if (exists) {
        return prev.map(p => p.karat === karat ? { ...p, price, lastUpdated: new Date().toISOString() } : p);
      }
      return [...prev, { karat, price, lastUpdated: new Date().toISOString() }];
    });
  };

  const addSupplier = (s: Supplier) => setSuppliers([...suppliers, s]);

  const addSupplyTransaction = (t: SupplyTransaction) => {
    setSupplyTransactions([t, ...supplyTransactions]);
    
    // Increase Stock automatically
    setProducts(prev => prev.map(p => 
        p.id === t.productId 
        ? { ...p, quantity: p.quantity + t.quantity } 
        : p
    ));

    // Update Supplier Stats (increase items supplied count)
    setSuppliers(prev => prev.map(s => 
        s.id === t.supplierId 
        ? { ...s, itemsSupplied: s.itemsSupplied + 1 }
        : s
    ));
  };

  return (
    <StoreContext.Provider value={{
      user, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      customers, addCustomer,
      sales, addSale,
      goldPrices, updateGoldPrice,
      suppliers, addSupplier,
      supplyTransactions, addSupplyTransaction
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};