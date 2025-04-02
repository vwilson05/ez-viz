import { DatabaseSchema, QueryResult } from './types'

// Mock database schema for development
export const mockDatabaseSchema = {
  name: 'SAMPLE_DB',
  schemas: [
    {
      name: 'PUBLIC',
      tables: [
        {
          name: 'CUSTOMERS',
          columns: [
            { name: 'CUSTOMER_ID', type: 'NUMBER', isPrimaryKey: true },
            { name: 'FIRST_NAME', type: 'VARCHAR' },
            { name: 'LAST_NAME', type: 'VARCHAR' },
            { name: 'EMAIL', type: 'VARCHAR' },
            { name: 'PHONE', type: 'VARCHAR' },
            { name: 'ADDRESS', type: 'VARCHAR' },
            { name: 'CITY', type: 'VARCHAR' },
            { name: 'STATE', type: 'VARCHAR' },
            { name: 'COUNTRY', type: 'VARCHAR' },
            { name: 'POSTAL_CODE', type: 'VARCHAR' },
            { name: 'CREATED_AT', type: 'TIMESTAMP_NTZ' }
          ]
        },
        {
          name: 'ORDERS',
          columns: [
            { name: 'ORDER_ID', type: 'NUMBER', isPrimaryKey: true },
            { name: 'CUSTOMER_ID', type: 'NUMBER', isForeignKey: true, references: { table: 'CUSTOMERS', column: 'CUSTOMER_ID' } },
            { name: 'ORDER_DATE', type: 'DATE' },
            { name: 'STATUS', type: 'VARCHAR' },
            { name: 'TOTAL_AMOUNT', type: 'NUMBER' }
          ]
        },
        {
          name: 'PRODUCTS',
          columns: [
            { name: 'PRODUCT_ID', type: 'NUMBER', isPrimaryKey: true },
            { name: 'NAME', type: 'VARCHAR' },
            { name: 'DESCRIPTION', type: 'VARCHAR' },
            { name: 'CATEGORY', type: 'VARCHAR' },
            { name: 'PRICE', type: 'NUMBER' },
            { name: 'STOCK_QUANTITY', type: 'NUMBER' }
          ]
        },
        {
          name: 'ORDER_ITEMS',
          columns: [
            { name: 'ORDER_ITEM_ID', type: 'NUMBER', isPrimaryKey: true },
            { name: 'ORDER_ID', type: 'NUMBER', isForeignKey: true, references: { table: 'ORDERS', column: 'ORDER_ID' } },
            { name: 'PRODUCT_ID', type: 'NUMBER', isForeignKey: true, references: { table: 'PRODUCTS', column: 'PRODUCT_ID' } },
            { name: 'QUANTITY', type: 'NUMBER' },
            { name: 'UNIT_PRICE', type: 'NUMBER' },
            { name: 'SUBTOTAL', type: 'NUMBER' }
          ]
        }
      ]
    },
    {
      name: 'ANALYTICS',
      tables: [
        {
          name: 'DAILY_SALES',
          columns: [
            { name: 'DATE', type: 'DATE', isPrimaryKey: true },
            { name: 'TOTAL_ORDERS', type: 'NUMBER' },
            { name: 'TOTAL_REVENUE', type: 'NUMBER' },
            { name: 'AVERAGE_ORDER_VALUE', type: 'NUMBER' }
          ]
        },
        {
          name: 'CUSTOMER_SEGMENTS',
          columns: [
            { name: 'SEGMENT_ID', type: 'NUMBER', isPrimaryKey: true },
            { name: 'SEGMENT_NAME', type: 'VARCHAR' },
            { name: 'CUSTOMER_COUNT', type: 'NUMBER' },
            { name: 'AVERAGE_LIFETIME_VALUE', type: 'NUMBER' }
          ]
        }
      ]
    }
  ]
};

// Mock table data as QueryResult objects for backward compatibility
export const mockCustomersData: QueryResult = {
  columns: ['CUSTOMER_ID', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE', 'ADDRESS', 'CITY', 'STATE', 'COUNTRY', 'POSTAL_CODE', 'CREATED_AT'],
  rows: [
    { CUSTOMER_ID: 1, FIRST_NAME: 'John', LAST_NAME: 'Doe', EMAIL: 'john.doe@example.com', PHONE: '555-123-4567', ADDRESS: '123 Main St', CITY: 'Boston', STATE: 'MA', COUNTRY: 'USA', POSTAL_CODE: '02108', CREATED_AT: '2023-01-15 09:30:00' },
    { CUSTOMER_ID: 2, FIRST_NAME: 'Jane', LAST_NAME: 'Smith', EMAIL: 'jane.smith@example.com', PHONE: '555-987-6543', ADDRESS: '456 Oak Ave', CITY: 'San Francisco', STATE: 'CA', COUNTRY: 'USA', POSTAL_CODE: '94107', CREATED_AT: '2023-02-20 14:45:00' },
    { CUSTOMER_ID: 3, FIRST_NAME: 'Michael', LAST_NAME: 'Johnson', EMAIL: 'michael.j@example.com', PHONE: '555-456-7890', ADDRESS: '789 Pine Rd', CITY: 'Chicago', STATE: 'IL', COUNTRY: 'USA', POSTAL_CODE: '60601', CREATED_AT: '2023-03-10 11:15:00' },
    { CUSTOMER_ID: 4, FIRST_NAME: 'Emily', LAST_NAME: 'Brown', EMAIL: 'emily.b@example.com', PHONE: '555-678-9012', ADDRESS: '321 Cedar Ln', CITY: 'Seattle', STATE: 'WA', COUNTRY: 'USA', POSTAL_CODE: '98101', CREATED_AT: '2023-04-05 16:30:00' },
    { CUSTOMER_ID: 5, FIRST_NAME: 'David', LAST_NAME: 'Wilson', EMAIL: 'david.w@example.com', PHONE: '555-890-1234', ADDRESS: '654 Maple Dr', CITY: 'Austin', STATE: 'TX', COUNTRY: 'USA', POSTAL_CODE: '78701', CREATED_AT: '2023-05-12 10:00:00' }
  ],
  totalRows: 5,
  queryId: 'mock-customers-query'
};

export const mockOrdersData: QueryResult = {
  columns: ['ORDER_ID', 'CUSTOMER_ID', 'ORDER_DATE', 'STATUS', 'TOTAL_AMOUNT'],
  rows: [
    { ORDER_ID: 101, CUSTOMER_ID: 1, ORDER_DATE: '2023-06-01', STATUS: 'Completed', TOTAL_AMOUNT: 125.50 },
    { ORDER_ID: 102, CUSTOMER_ID: 2, ORDER_DATE: '2023-06-02', STATUS: 'Completed', TOTAL_AMOUNT: 89.99 },
    { ORDER_ID: 103, CUSTOMER_ID: 3, ORDER_DATE: '2023-06-03', STATUS: 'Processing', TOTAL_AMOUNT: 212.75 },
    { ORDER_ID: 104, CUSTOMER_ID: 1, ORDER_DATE: '2023-06-05', STATUS: 'Processing', TOTAL_AMOUNT: 45.25 },
    { ORDER_ID: 105, CUSTOMER_ID: 4, ORDER_DATE: '2023-06-07', STATUS: 'Completed', TOTAL_AMOUNT: 159.00 },
    { ORDER_ID: 106, CUSTOMER_ID: 5, ORDER_DATE: '2023-06-08', STATUS: 'Cancelled', TOTAL_AMOUNT: 78.50 },
    { ORDER_ID: 107, CUSTOMER_ID: 2, ORDER_DATE: '2023-06-10', STATUS: 'Completed', TOTAL_AMOUNT: 132.99 }
  ],
  totalRows: 7,
  queryId: 'mock-orders-query'
};

export const mockProductsData: QueryResult = {
  columns: ['PRODUCT_ID', 'NAME', 'DESCRIPTION', 'CATEGORY', 'PRICE', 'STOCK_QUANTITY'],
  rows: [
    { PRODUCT_ID: 201, NAME: 'Laptop', DESCRIPTION: 'High-performance laptop', CATEGORY: 'Electronics', PRICE: 1299.99, STOCK_QUANTITY: 45 },
    { PRODUCT_ID: 202, NAME: 'Smartphone', DESCRIPTION: 'Latest model smartphone', CATEGORY: 'Electronics', PRICE: 899.99, STOCK_QUANTITY: 78 },
    { PRODUCT_ID: 203, NAME: 'Coffee Maker', DESCRIPTION: 'Automatic coffee machine', CATEGORY: 'Kitchen', PRICE: 149.99, STOCK_QUANTITY: 32 },
    { PRODUCT_ID: 204, NAME: 'Running Shoes', DESCRIPTION: 'Comfortable running shoes', CATEGORY: 'Sports', PRICE: 89.99, STOCK_QUANTITY: 54 },
    { PRODUCT_ID: 205, NAME: 'Desk Chair', DESCRIPTION: 'Ergonomic office chair', CATEGORY: 'Furniture', PRICE: 249.99, STOCK_QUANTITY: 21 }
  ],
  totalRows: 5,
  queryId: 'mock-products-query'
};

export const mockOrderItemsData: QueryResult = {
  columns: ['ORDER_ITEM_ID', 'ORDER_ID', 'PRODUCT_ID', 'QUANTITY', 'UNIT_PRICE', 'SUBTOTAL'],
  rows: [
    { ORDER_ITEM_ID: 301, ORDER_ID: 101, PRODUCT_ID: 201, QUANTITY: 1, UNIT_PRICE: 1299.99, SUBTOTAL: 1299.99 },
    { ORDER_ITEM_ID: 302, ORDER_ID: 102, PRODUCT_ID: 204, QUANTITY: 1, UNIT_PRICE: 89.99, SUBTOTAL: 89.99 },
    { ORDER_ITEM_ID: 303, ORDER_ID: 103, PRODUCT_ID: 203, QUANTITY: 1, UNIT_PRICE: 149.99, SUBTOTAL: 149.99 },
    { ORDER_ITEM_ID: 304, ORDER_ID: 103, PRODUCT_ID: 205, QUANTITY: 1, UNIT_PRICE: 249.99, SUBTOTAL: 249.99 },
    { ORDER_ITEM_ID: 305, ORDER_ID: 104, PRODUCT_ID: 204, QUANTITY: 1, UNIT_PRICE: 89.99, SUBTOTAL: 89.99 },
    { ORDER_ITEM_ID: 306, ORDER_ID: 105, PRODUCT_ID: 202, QUANTITY: 1, UNIT_PRICE: 899.99, SUBTOTAL: 899.99 },
    { ORDER_ITEM_ID: 307, ORDER_ID: 106, PRODUCT_ID: 203, QUANTITY: 1, UNIT_PRICE: 149.99, SUBTOTAL: 149.99 },
    { ORDER_ITEM_ID: 308, ORDER_ID: 107, PRODUCT_ID: 204, QUANTITY: 2, UNIT_PRICE: 89.99, SUBTOTAL: 179.98 }
  ],
  totalRows: 8,
  queryId: 'mock-order-items-query'
};

// Helper function to get mock data for a specified table
export const getMockTableData = (tableName: string) => {
  return mockTableData[tableName as keyof typeof mockTableData] || [];
};

// Mock table data
export const mockTableData = {
  'CUSTOMERS': mockCustomersData.rows,
  'ORDERS': mockOrdersData.rows,
  'PRODUCTS': mockProductsData.rows,
  'ORDER_ITEMS': mockOrderItemsData.rows,
  'DAILY_SALES': [
    { DATE: '2023-06-01', TOTAL_ORDERS: 12, TOTAL_REVENUE: 3456.78, AVERAGE_ORDER_VALUE: 288.07 },
    { DATE: '2023-06-02', TOTAL_ORDERS: 8, TOTAL_REVENUE: 2134.56, AVERAGE_ORDER_VALUE: 266.82 },
    { DATE: '2023-06-03', TOTAL_ORDERS: 15, TOTAL_REVENUE: 4567.89, AVERAGE_ORDER_VALUE: 304.53 },
    { DATE: '2023-06-04', TOTAL_ORDERS: 10, TOTAL_REVENUE: 2987.65, AVERAGE_ORDER_VALUE: 298.77 },
    { DATE: '2023-06-05', TOTAL_ORDERS: 14, TOTAL_REVENUE: 3876.54, AVERAGE_ORDER_VALUE: 276.90 }
  ],
  'CUSTOMER_SEGMENTS': [
    { SEGMENT_ID: 1, SEGMENT_NAME: 'High Value', CUSTOMER_COUNT: 120, AVERAGE_LIFETIME_VALUE: 5200.00 },
    { SEGMENT_ID: 2, SEGMENT_NAME: 'Regular', CUSTOMER_COUNT: 450, AVERAGE_LIFETIME_VALUE: 950.00 },
    { SEGMENT_ID: 3, SEGMENT_NAME: 'New', CUSTOMER_COUNT: 210, AVERAGE_LIFETIME_VALUE: 150.00 },
    { SEGMENT_ID: 4, SEGMENT_NAME: 'Dormant', CUSTOMER_COUNT: 185, AVERAGE_LIFETIME_VALUE: 875.00 }
  ]
};

// Data for visualization charts
export interface ChartDataPoint {
  label: string;
  value: number;
}

export const salesTrendData: ChartDataPoint[] = [
  { label: 'Jan', value: 12500 },
  { label: 'Feb', value: 18200 },
  { label: 'Mar', value: 16800 },
  { label: 'Apr', value: 19500 },
  { label: 'May', value: 22300 },
  { label: 'Jun', value: 26500 },
];

export const productSalesData: ChartDataPoint[] = [
  { label: 'Shoes', value: 33400 },
  { label: 'Shirts', value: 26700 },
  { label: 'Pants', value: 19200 },
  { label: 'Hats', value: 8500 },
  { label: 'Accessories', value: 12900 },
];

export const channelDistributionData: ChartDataPoint[] = [
  { label: 'Web', value: 47 },
  { label: 'Mobile', value: 32 },
  { label: 'In-store', value: 14 },
  { label: 'Partnerships', value: 7 },
]; 