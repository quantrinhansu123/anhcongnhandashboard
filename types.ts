export interface SaleRecord {
  _id: string; // Internal ID for React rendering
  [key: string]: any; // Allow any column name from AppSheet
}

export interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProduct: string;
}

// Helper to define field types for the app to understand which column is which
export interface FieldMapping {
  dateField: string;
  amountField: string;
  productField: string;
  quantityField: string;
}