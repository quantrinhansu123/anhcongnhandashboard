// Credentials provided by the user
export const APP_ID = 'a6411e78-7883-47ae-a563-a502b708f8bf';
export const API_KEY = 'V2-IG5lt-V4Jl8-rmIyz-scJzB-HYQcP-iYsih-aQ1yW-5r5Kj';
export const TABLE_NAME = 'Bán hàng';
export const CUSTOMER_TABLE_NAME = 'Danh sách KH';
export const TIMEKEEPING_TABLE_NAME = 'Chấm công';
export const PERSONNEL_TABLE_NAME = 'Nhân sự';
export const REVENUE_EXPENSE_TABLE_NAME = 'Thu chi';

// API Configuration (Simulated)
export const API_BASE_URL = 'https://api.example-service.com/v1'; // Placeholder

export const CURRENCY_FORMAT = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export const DATE_FORMAT = new Intl.DateTimeFormat('vi-VN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});