import { SaleRecord } from '../types';
import { APP_ID, API_KEY } from '../constants';

const getApiUrl = (tableName: string) => 
  `https://api.appsheet.com/api/v2/apps/${APP_ID}/tables/${encodeURIComponent(tableName)}/Action`;

export const fetchTableData = async (tableName: string): Promise<SaleRecord[]> => {
  try {
    const response = await fetch(getApiUrl(tableName), {
      method: 'POST',
      headers: {
        'ApplicationAccessKey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "Action": "Find",
        "Properties": {
          "Locale": "vi-VN",
          "Timezone": "Asia/Ho_Chi_Minh"
        },
        "Rows": []
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      console.warn(`API returned non-array structure for table ${tableName}:`, rawData);
      return [];
    }

    // Return raw data, just ensuring we have a unique ID for React
    return rawData.map((row: any, index: number) => {
      // Try to find a unique key in common AppSheet hidden columns or use index
      const id = row['_RowNumber'] || row['Row ID'] || row['ID'] || `row-${index}`;
      return {
        ...row,
        _id: String(id)
      };
    });

  } catch (error) {
    console.error(`Fetch Data Error (${tableName}):`, error);
    throw error;
  }
};

// Helper to guess which columns correspond to business logic (Date, Amount, Product)
export const guessFieldMapping = (sampleRow: any) => {
  const keys = Object.keys(sampleRow).filter(k => k !== '_id');
  const lowerKeys = keys.map(k => ({ key: k, lower: k.toLowerCase() }));

  const findKey = (candidates: string[]) => 
    lowerKeys.find(k => candidates.some(c => k.lower.includes(c)))?.key || '';

  return {
    dateField: findKey(['ngày', 'date', 'time']),
    amountField: findKey(['thành tiền', 'thanh tien', 'amount', 'total', 'tổng']),
    productField: findKey(['tên hàng', 'ten hang', 'product', 'item', 'mặt hàng']),
    quantityField: findKey(['số lượng', 'so luong', 'qty', 'quantity', 'sl'])
  };
};

// Helper to guess columns for Timekeeping (Employee Name, Date)
export const guessTimekeepingMapping = (sampleRow: any) => {
  const keys = Object.keys(sampleRow).filter(k => k !== '_id');
  const lowerKeys = keys.map(k => ({ key: k, lower: k.toLowerCase().trim() }));

  const findKey = (candidates: string[]) => {
    // First try exact match (case-insensitive)
    for (const candidate of candidates) {
      const exactMatch = keys.find(k => k.toLowerCase().trim() === candidate.toLowerCase().trim());
      if (exactMatch) return exactMatch;
    }
    // Then try partial match
    return lowerKeys.find(k => candidates.some(c => k.lower.includes(c.toLowerCase())))?.key || '';
  };

  return {
    employeeField: findKey(['nhân sự', 'nhân sựu', 'tên nhân viên', 'nhân viên', 'employee', 'name', 'họ tên', 'người làm']),
    dateField: findKey(['ngày', 'date', 'time', 'checkin', 'giờ']),
  };
};

// Helper to guess columns for Personnel (Employee Name)
export const guessPersonnelMapping = (sampleRow: any) => {
  const keys = Object.keys(sampleRow).filter(k => k !== '_id');
  const lowerKeys = keys.map(k => ({ key: k, lower: k.toLowerCase() }));

  const findKey = (candidates: string[]) => 
    lowerKeys.find(k => candidates.some(c => k.lower.includes(c)))?.key || '';

  return {
    nameField: findKey(['tên nhân viên', 'tên', 'họ tên', 'nhân viên', 'employee', 'name', 'full name']),
  };
};