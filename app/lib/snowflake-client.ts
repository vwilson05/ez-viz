'use client'

import { QueryResult, ConnectionInfo } from './types'

// Current active connection info
let currentConnection: ConnectionInfo | null = null;

/**
 * Connect to Snowflake with the provided credentials
 */
export async function connectToSnowflake(connectionInfo: ConnectionInfo): Promise<boolean> {
  try {
    console.log('connectToSnowflake called with:', {
      account: connectionInfo.account,
      username: connectionInfo.username,
      hasPassword: !!connectionInfo.password,
      warehouse: connectionInfo.warehouse,
      database: connectionInfo.database
    });
    
    // Create an AbortController with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    // Validate the connection by making an API call
    const response = await fetch('/api/snowflake/schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connectionInfo),
      signal: controller.signal
    });

    // Clear the timeout
    clearTimeout(timeoutId);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Snowflake connection error:', data);
      throw new Error(data.error || 'Failed to connect to Snowflake');
    }
    
    console.log('Snowflake connection successful');
    
    // Store connection info for future queries
    currentConnection = connectionInfo;
    
    return true;
  } catch (error: any) {
    console.error('Error connecting to Snowflake:', error);
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Get database schema - lightweight version that only returns schema names
 */
export async function getSchema(connectionInfo?: ConnectionInfo, retryCount = 0, maxRetries = 3): Promise<any> {
  const connInfo = connectionInfo || currentConnection;
  
  if (!connInfo) {
    throw new Error('No active connection. Please connect to Snowflake first.');
  }
  
  console.log('getSchema called with:', { 
    account: connInfo.account,
    username: connInfo.username,
    hasPassword: !!connInfo.password,
    warehouse: connInfo.warehouse,
    database: connInfo.database,
    schema: connInfo.schema,
    role: connInfo.role || 'undefined'
  });
  
  try {
    // Create request body with explicit role
    const requestBody: any = {
      account: connInfo.account,
      username: connInfo.username,
      password: connInfo.password,
      warehouse: connInfo.warehouse,
      database: connInfo.database,
      schema: connInfo.schema || 'PUBLIC'
    };
    
    // Only add role if it's defined and not empty
    if (connInfo.role) {
      requestBody.role = connInfo.role;
    }
    
    const response = await fetch('/api/snowflake/schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Snowflake schema fetch error:', data);
      throw new Error(data.error || 'Failed to fetch schema');
    }
    
    console.log('Schema retrieved successfully');
    return data;
  } catch (error: any) {
    console.error('Error fetching schema:', error);
    
    // Implement exponential backoff for retries
    if (retryCount < maxRetries) {
      const backoffMs = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s, ...
      console.log(`Waiting ${backoffMs}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      return getSchema(connInfo, retryCount + 1, maxRetries);
    }
    
    throw error;
  }
}

/**
 * Get tables for a specific schema (on demand)
 */
export async function getTablesForSchema(
  schemaName: string, 
  connectionInfo?: ConnectionInfo
): Promise<any[]> {
  const connInfo = connectionInfo || currentConnection;
  
  if (!connInfo) {
    throw new Error('No active connection. Please connect to Snowflake first.');
  }
  
  console.log(`Getting tables for schema: ${schemaName}`);
  
  try {
    // Create request body with schema name
    const requestBody: any = {
      account: connInfo.account,
      username: connInfo.username,
      password: connInfo.password,
      warehouse: connInfo.warehouse,
      database: connInfo.database,
      schema: schemaName
    };
    
    // Only add role if it's defined and not empty
    if (connInfo.role) {
      requestBody.role = connInfo.role;
    }
    
    const response = await fetch('/api/snowflake/schema/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Snowflake tables fetch error:', data);
      throw new Error(data.error || `Failed to fetch tables for schema: ${schemaName}`);
    }
    
    console.log(`Retrieved ${data.length} tables for schema: ${schemaName}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching tables for schema ${schemaName}:`, error);
    throw error;
  }
}

/**
 * Get columns for a specific table (on demand)
 */
export async function getColumnsForTable(
  connectionInfo: ConnectionInfo,
  schemaName: string, 
  tableName: string
): Promise<any[]> {
  const connInfo = connectionInfo || currentConnection;
  
  if (!connInfo) {
    throw new Error('No active connection. Please connect to Snowflake first.');
  }
  
  console.log(`Getting columns for table: ${schemaName}.${tableName}`);
  
  try {
    // For development, return mock columns if we detect mock table names
    if (['CUSTOMERS', 'ORDERS', 'PRODUCTS', 'ORDER_ITEMS'].includes(tableName.toUpperCase())) {
      console.log('Using mock columns for development');
      return getMockColumnsForTable(tableName);
    }
    
    // Create request body with schema and table name
    const requestBody: any = {
      account: connInfo.account,
      username: connInfo.username,
      password: connInfo.password,
      warehouse: connInfo.warehouse,
      database: connInfo.database,
      schema: schemaName,
      tableName: tableName
    };
    
    // Only add role if it's defined and not empty
    if (connInfo.role) {
      requestBody.role = connInfo.role;
    }
    
    const response = await fetch('/api/snowflake/schema/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Snowflake columns fetch error:', data);
      throw new Error(data.error || `Failed to fetch columns for table: ${schemaName}.${tableName}`);
    }
    
    console.log(`Retrieved ${data.length} columns for table: ${schemaName}.${tableName}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching columns for table ${schemaName}.${tableName}:`, error);
    throw error;
  }
}

// Helper function to get mock columns for development
function getMockColumnsForTable(tableName: string): any[] {
  const tableNameUpper = tableName.toUpperCase();
  
  switch (tableNameUpper) {
    case 'CUSTOMERS':
      return [
        { name: 'CUSTOMER_ID', type: 'VARCHAR', isPrimaryKey: true },
        { name: 'FIRST_NAME', type: 'VARCHAR' },
        { name: 'LAST_NAME', type: 'VARCHAR' },
        { name: 'EMAIL', type: 'VARCHAR' },
        { name: 'PHONE', type: 'VARCHAR' },
        { name: 'ADDRESS', type: 'VARCHAR' },
        { name: 'CITY', type: 'VARCHAR' },
        { name: 'STATE', type: 'VARCHAR' },
        { name: 'ZIPCODE', type: 'VARCHAR' },
        { name: 'CREATED_AT', type: 'TIMESTAMP_NTZ' }
      ];
    case 'ORDERS':
      return [
        { name: 'ORDER_ID', type: 'VARCHAR', isPrimaryKey: true },
        { name: 'CUSTOMER_ID', type: 'VARCHAR', isForeignKey: true, references: { table: 'CUSTOMERS', column: 'CUSTOMER_ID' } },
        { name: 'ORDER_DATE', type: 'DATE' },
        { name: 'ORDER_STATUS', type: 'VARCHAR' },
        { name: 'TOTAL_AMOUNT', type: 'NUMBER' },
        { name: 'SHIPPING_ADDRESS', type: 'VARCHAR' },
        { name: 'SHIPPING_CITY', type: 'VARCHAR' },
        { name: 'SHIPPING_STATE', type: 'VARCHAR' },
        { name: 'SHIPPING_ZIPCODE', type: 'VARCHAR' },
        { name: 'PAYMENT_METHOD', type: 'VARCHAR' }
      ];
    case 'PRODUCTS':
      return [
        { name: 'PRODUCT_ID', type: 'VARCHAR', isPrimaryKey: true },
        { name: 'PRODUCT_NAME', type: 'VARCHAR' },
        { name: 'DESCRIPTION', type: 'VARCHAR' },
        { name: 'CATEGORY', type: 'VARCHAR' },
        { name: 'PRICE', type: 'NUMBER' },
        { name: 'STOCK_QUANTITY', type: 'NUMBER' },
        { name: 'SUPPLIER', type: 'VARCHAR' },
        { name: 'CREATED_AT', type: 'TIMESTAMP_NTZ' },
        { name: 'UPDATED_AT', type: 'TIMESTAMP_NTZ' },
        { name: 'IS_ACTIVE', type: 'BOOLEAN' }
      ];
    case 'ORDER_ITEMS':
      return [
        { name: 'ORDER_ITEM_ID', type: 'VARCHAR', isPrimaryKey: true },
        { name: 'ORDER_ID', type: 'VARCHAR', isForeignKey: true, references: { table: 'ORDERS', column: 'ORDER_ID' } },
        { name: 'PRODUCT_ID', type: 'VARCHAR', isForeignKey: true, references: { table: 'PRODUCTS', column: 'PRODUCT_ID' } },
        { name: 'QUANTITY', type: 'NUMBER' },
        { name: 'UNIT_PRICE', type: 'NUMBER' },
        { name: 'DISCOUNT', type: 'NUMBER' },
        { name: 'TOTAL_PRICE', type: 'NUMBER' },
        { name: 'CREATED_AT', type: 'TIMESTAMP_NTZ' }
      ];
    default:
      // Return empty array for unknown tables
      return [];
  }
}

/**
 * Execute a SQL query against Snowflake
 */
export async function executeQuery(query: string, connectionInfo?: ConnectionInfo): Promise<QueryResult> {
  const connInfo = connectionInfo || currentConnection;
  
  if (!connInfo) {
    throw new Error('No active connection. Please connect to Snowflake first.');
  }
  
  console.log('executeQuery called with connection:', {
    account: connInfo.account,
    username: connInfo.username,
    warehouse: connInfo.warehouse,
    database: connInfo.database,
    schema: connInfo.schema,
    role: connInfo.role || 'undefined'
  });
  
  try {
    // Create connection object with role if present
    const connection: any = {
      account: connInfo.account,
      username: connInfo.username,
      password: connInfo.password,
      warehouse: connInfo.warehouse,
      database: connInfo.database
    };
    
    // Always include schema in the connection
    // This is important for queries that use fully qualified names
    connection.schema = connInfo.schema || 'PUBLIC';
    
    // Only add role if it's defined and not empty
    if (connInfo.role) {
      connection.role = connInfo.role;
    }
    
    console.log(`Executing query: ${query}`);
    console.log(`Using schema: ${connection.schema}`);
    
    const response = await fetch('/api/snowflake/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        connection,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute query');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

/**
 * Helper function to perform CRUD operations
 */
export async function performCrudOperation(
  operation: 'insert' | 'update' | 'delete',
  tableName: string,
  data?: Record<string, any>,
  whereClause?: string,
  whereParams?: any[],
  connectionInfo?: ConnectionInfo
): Promise<any> {
  const connInfo = connectionInfo || currentConnection;
  
  if (!connInfo) {
    throw new Error('No active connection. Please connect to Snowflake first.');
  }
  
  console.log(`performCrudOperation (${operation}) called with connection:`, {
    account: connInfo.account,
    username: connInfo.username,
    warehouse: connInfo.warehouse,
    database: connInfo.database,
    schema: connInfo.schema,
    role: connInfo.role || 'undefined'
  });
  
  try {
    // Create connection object with role if present
    const connection: any = {
      account: connInfo.account,
      username: connInfo.username,
      password: connInfo.password,
      warehouse: connInfo.warehouse,
      database: connInfo.database,
      schema: connInfo.schema || 'PUBLIC'
    };
    
    // Only add role if it's defined and not empty
    if (connInfo.role) {
      connection.role = connInfo.role;
    }
    
    const response = await fetch('/api/snowflake/crud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operation,
        tableName,
        data,
        whereClause,
        whereParams,
        connection,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to ${operation} data`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error(`Error performing ${operation}:`, error);
    throw error;
  }
}

/**
 * Insert data into a table
 */
export function insertData(
  tableName: string,
  data: Record<string, any>,
  connectionInfo?: ConnectionInfo
): Promise<any> {
  return performCrudOperation('insert', tableName, data, undefined, undefined, connectionInfo);
}

/**
 * Update data in a table
 */
export function updateData(
  tableName: string,
  data: Record<string, any>,
  whereClause: string,
  whereParams: any[] = [],
  connectionInfo?: ConnectionInfo
): Promise<any> {
  return performCrudOperation('update', tableName, data, whereClause, whereParams, connectionInfo);
}

/**
 * Delete data from a table
 */
export function deleteData(
  tableName: string,
  whereClause: string,
  whereParams: any[] = [],
  connectionInfo?: ConnectionInfo
): Promise<any> {
  return performCrudOperation('delete', tableName, undefined, whereClause, whereParams, connectionInfo);
}