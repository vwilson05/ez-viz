import snowflake from 'snowflake-sdk';

// Snowflake connection configuration
interface SnowflakeConfig {
  account: string;
  username: string;
  password: string;
  warehouse: string;
  database: string;
  schema?: string;
  role?: string;
}

// Connection pool to reuse connections
const connectionPool: Record<string, snowflake.Connection> = {};

// Get a Snowflake connection (reuse if exists)
export async function getConnection(config: SnowflakeConfig): Promise<snowflake.Connection> {
  const connectionKey = `${config.account}:${config.username}:${config.database}:${config.role || 'default'}`;
  
  // Handle Snowflake account URL format
  let accountId = config.account;
  
  // Remove .snowflakecomputing.com if it's already included
  if (accountId.includes('.snowflakecomputing.com')) {
    accountId = accountId.replace('.snowflakecomputing.com', '');
  }
  
  console.log('Processing Snowflake connection with account ID:', accountId);
  
  if (connectionPool[connectionKey] && isConnectionUp(connectionPool[connectionKey])) {
    return connectionPool[connectionKey];
  }
  
  return new Promise((resolve, reject) => {
    // Create a connection
    const connection = snowflake.createConnection({
      account: accountId,
      username: config.username,
      password: config.password,
      warehouse: config.warehouse,
      database: config.database,
      schema: config.schema || 'PUBLIC',
      role: config.role
    });
    
    // Connect to Snowflake
    connection.connect((err, conn) => {
      if (err) {
        console.error('Error connecting to Snowflake:', err);
        
        // Provide more helpful error messages
        if (err.message && err.message.includes('Hostname/IP does not match certificate')) {
          reject(new Error('Invalid Snowflake account format. Please enter just the account identifier without the full domain.'));
        } else if (err.message && err.message.includes('Authentication failed')) {
          reject(new Error('Authentication failed. Please check your username and password.'));
        } else if (err.message && err.message.includes('Database') && err.message.includes('not found')) {
          reject(new Error('Database not found. Please check your database name.'));
        } else if (err.message && err.message.includes('Warehouse') && err.message.includes('not found')) {
          reject(new Error('Warehouse not found. Please check your warehouse name.'));
        } else {
          reject(err);
        }
      } else {
        if (conn) {
          connectionPool[connectionKey] = conn;
          resolve(conn);
        } else {
          reject(new Error('Failed to establish connection to Snowflake'));
        }
      }
    });
  });
}

// Check if connection is up
function isConnectionUp(connection: snowflake.Connection): boolean {
  try {
    // This is a simple check, might need to be adjusted based on Snowflake SDK specifics
    return connection !== null && connection !== undefined;
  } catch (err) {
    return false;
  }
}

// Execute a SQL query and return results
export async function executeQuery(
  connection: snowflake.Connection, 
  query: string, 
  binds: any[] = []
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      binds: binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    });
  });
}

// Get database schema names only (lightweight initial load)
export async function getDatabaseSchema(connection: snowflake.Connection): Promise<any> {
  try {
    console.log('Getting database schemas');
    
    // First, get a list of all schemas in the database
    const schemaQuery = `
      SELECT 
        SCHEMA_NAME 
      FROM 
        INFORMATION_SCHEMA.SCHEMATA 
      WHERE 
        SCHEMA_NAME NOT LIKE 'INFORMATION_SCHEMA%'
        AND CATALOG_NAME = CURRENT_DATABASE()
      ORDER BY 
        SCHEMA_NAME`;
    
    const schemaResults = await executeQuery(connection, schemaQuery, []);
    const schemas = schemaResults.map((row: any) => row.SCHEMA_NAME);
    
    console.log(`Found ${schemas.length} schemas:`, schemas);
    
    // Return just schema names for faster initial load
    const schemasData = schemas.map(schemaName => ({
      name: schemaName,
      tables: [] // Empty tables array - will be populated on demand
    }));
    
    return {
      name: await getCurrentDatabase(connection),
      schemas: schemasData
    };
  } catch (error) {
    console.error('Error getting database schema:', error);
    throw error;
  }
}

// Get tables for a specific schema (on demand loading)
export async function getTablesForSchema(connection: snowflake.Connection, schemaName: string): Promise<any[]> {
  try {
    console.log(`Getting tables for schema: ${schemaName}`);
    
    const tablesQuery = `
      SELECT 
        TABLE_NAME
      FROM 
        INFORMATION_SCHEMA.TABLES 
      WHERE 
        TABLE_SCHEMA = ? 
        AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY 
        TABLE_NAME`;
    
    const tableResults = await executeQuery(connection, tablesQuery, [schemaName]);
    
    // Return just table names for now
    return tableResults.map((row: any) => ({
      name: row.TABLE_NAME,
      columns: [] // Empty columns array - will be populated on demand
    }));
  } catch (error) {
    console.error(`Error getting tables for schema ${schemaName}:`, error);
    throw error;
  }
}

// Get columns for a specific table (on demand loading)
export async function getColumnsForTable(
  connection: snowflake.Connection, 
  schemaName: string, 
  tableName: string
): Promise<any[]> {
  try {
    console.log(`Getting columns for table: ${schemaName}.${tableName}`);
    
    const columnsQuery = `
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        CHARACTER_MAXIMUM_LENGTH
      FROM 
        INFORMATION_SCHEMA.COLUMNS 
      WHERE 
        TABLE_SCHEMA = ? 
        AND TABLE_NAME = ?
      ORDER BY 
        ORDINAL_POSITION`;
    
    const columnResults = await executeQuery(connection, columnsQuery, [schemaName, tableName]);
    
    // Format column results - without trying to detect PK/FK relationships
    return columnResults.map((col: any) => {
      return {
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        isNullable: col.IS_NULLABLE === 'YES',
        defaultValue: col.COLUMN_DEFAULT,
        maxLength: col.CHARACTER_MAXIMUM_LENGTH,
        // Assume common ID patterns
        isPrimaryKey: col.COLUMN_NAME.toUpperCase() === 'ID' || 
                      col.COLUMN_NAME.toUpperCase().endsWith('_ID') && 
                      col.COLUMN_NAME.toUpperCase() === `${tableName.toUpperCase()}_ID`,
        isForeignKey: col.COLUMN_NAME.toUpperCase().endsWith('_ID') && 
                      col.COLUMN_NAME.toUpperCase() !== `${tableName.toUpperCase()}_ID`
      } as any;
    });
  } catch (error) {
    console.error(`Error getting columns for table ${schemaName}.${tableName}:`, error);
    throw error;
  }
}

// Helper to get current database name
async function getCurrentDatabase(connection: snowflake.Connection): Promise<string> {
  const result = await executeQuery(connection, 'SELECT CURRENT_DATABASE() AS DB_NAME', []);
  return result[0].DB_NAME;
}

// Insert data
export async function insertData(
  connection: snowflake.Connection,
  tableName: string,
  data: Record<string, any>
): Promise<any> {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map(col => data[col]);
  
  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
  `;
  
  return executeQuery(connection, query, values);
}

// Update data
export async function updateData(
  connection: snowflake.Connection,
  tableName: string,
  data: Record<string, any>,
  whereClause: string,
  whereParams: any[] = []
): Promise<any> {
  const setClause = Object.keys(data)
    .map(col => `${col} = ?`)
    .join(', ');
  
  const values = [
    ...Object.values(data),
    ...whereParams
  ];
  
  const query = `
    UPDATE ${tableName}
    SET ${setClause}
    WHERE ${whereClause}
  `;
  
  return executeQuery(connection, query, values);
}

// Delete data
export async function deleteData(
  connection: snowflake.Connection,
  tableName: string,
  whereClause: string,
  whereParams: any[] = []
): Promise<any> {
  const query = `
    DELETE FROM ${tableName}
    WHERE ${whereClause}
  `;
  
  return executeQuery(connection, query, whereParams);
}

// Close all connections
export function closeAllConnections(): void {
  Object.values(connectionPool).forEach(conn => {
    if (conn && isConnectionUp(conn)) {
      conn.destroy(err => {
        if (err) console.error('Error closing connection:', err);
      });
    }
  });
  
  // Clear the connection pool
  Object.keys(connectionPool).forEach(key => {
    delete connectionPool[key];
  });
} 