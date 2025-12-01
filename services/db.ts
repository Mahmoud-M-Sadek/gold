const STORAGE_KEYS = {
  PRODUCTS: 'thahab_products',
  CUSTOMERS: 'thahab_customers',
  SALES: 'thahab_sales',
  SUPPLIERS: 'thahab_suppliers',
  PRICES: 'thahab_prices',
  USER: 'thahab_user'
};

export const DB = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key}`, e);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key}`, e);
    }
  },
  KEYS: STORAGE_KEYS
};