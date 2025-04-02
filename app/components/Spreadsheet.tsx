'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { 
  useTable, 
  useSortBy, 
  useResizeColumns, 
  useBlockLayout,
  useColumnOrder,
  HeaderGroup,
  Row,
  Cell
} from 'react-table'
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, ArrowPathIcon, XMarkIcon, PlusIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { executeQuery } from '../lib/snowflake-client'
import { QueryResult, Column } from '../lib/types'
// Keep mock data imports temporarily for backward compatibility
import { mockCustomersData, mockOrdersData, mockProductsData, mockOrderItemsData } from '../lib/mock-data'

interface SpreadsheetProps {
  tableName: string
  connection: {
    account: string
    username: string
    database: string
    warehouse: string
    schema?: string
  }
  isReportBuilder?: boolean
}

interface DraggedColumn {
  column: any
  tableName: string
  alias?: string
  selected: boolean
}

interface CustomColumn {
  name: string;
  formula: string;
  type: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'CUSTOM';
  sourceColumns: string[];
}

export default function Spreadsheet({ tableName, connection, isReportBuilder = false }: SpreadsheetProps) {
  const [data, setData] = useState<QueryResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedColumns, setDraggedColumns] = useState<DraggedColumn[]>([])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [sqlQuery, setSqlQuery] = useState<string>('')
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([])
  const [showFormulaModal, setShowFormulaModal] = useState(false)
  const [newFormula, setNewFormula] = useState<Partial<CustomColumn>>({
    name: '',
    formula: '',
    type: 'CUSTOM',
    sourceColumns: []
  })
  
  const dragColumnRef = useRef<number | null>(null);
  
  // State for grouping columns
  const [groupByColumns, setGroupByColumns] = useState<string[]>([]);
  const [groupingMode, setGroupingMode] = useState<boolean>(false);
  const [aggregationFunctions, setAggregationFunctions] = useState<Record<string, string>>({});
  
  // State for column menu
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!tableName || draggedColumns.length > 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Extract schema name if table name includes it (e.g., "SCHEMA.TABLE")
        let schema = 'PUBLIC';
        let table = tableName;
        
        if (tableName.includes('.')) {
          const parts = tableName.split('.');
          if (parts.length === 2) {
            schema = parts[0];
            table = parts[1];
          } else if (parts.length === 3) {
            // Handle fully qualified names: DATABASE.SCHEMA.TABLE
            schema = parts[1];
            table = parts[2];
          }
        }
        
        console.log(`Fetching data for ${schema}.${table}`);
        
        // Create a SQL query to select from the table with schema
        const sql = schema === 'PUBLIC' || !schema
          ? `SELECT * FROM "${connection.database}"."${table}" LIMIT 1000`
          : `SELECT * FROM "${connection.database}"."${schema}"."${table}" LIMIT 1000`;
        console.log('Executing SQL query:', sql);
        
        // Execute the query with explicit schema (not relying on connection schema)
        const queryConnection = {
          ...connection,
          schema // Override schema with the one from the table name
        };
        
        // Execute the query
        const result = await executeQuery(sql, queryConnection);
        setData({
          columns: result.columns,
          rows: result.rows,
          totalRows: result.totalRows,
          queryId: result.queryId
        });
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
        
        // Fallback to mock data for development
        const mockData = getMockDataForTable(tableName);
        if (mockData) {
          setData(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, draggedColumns.length]);

  const calculateCustomColumnValue = (record: any, customColumn: CustomColumn) => {
    try {
      switch (customColumn.type) {
        case 'SUM': {
          return customColumn.sourceColumns.reduce((sum, colName) => {
            const value = record[colName];
            return sum + (typeof value === 'number' ? value : 0);
          }, 0);
        }
        case 'AVG': {
          const values = customColumn.sourceColumns
            .map(colName => record[colName])
            .filter(val => typeof val === 'number');
          
          if (values.length === 0) return 0;
          return values.reduce((sum, val) => sum + val, 0) / values.length;
        }
        case 'COUNT': {
          return customColumn.sourceColumns
            .filter(colName => record[colName] !== undefined && record[colName] !== null)
            .length;
        }
        case 'MIN': {
          const values = customColumn.sourceColumns
            .map(colName => record[colName])
            .filter(val => typeof val === 'number');
          
          if (values.length === 0) return 0;
          return Math.min(...values);
        }
        case 'MAX': {
          const values = customColumn.sourceColumns
            .map(colName => record[colName])
            .filter(val => typeof val === 'number');
          
          if (values.length === 0) return 0;
          return Math.max(...values);
        }
        case 'CUSTOM': {
          // Simple formula evaluation logic - for demo purposes only
          // In a real app, you would use a proper formula parser
          const formula = customColumn.formula;
          let result = formula;
          
          // Replace column references with values
          customColumn.sourceColumns.forEach(colName => {
            const value = record[colName];
            // Convert value to a safe number
            const numericValue = typeof value === 'number' ? value : 0;
            // Safely replace all instances of this column in the formula
            const colPattern = new RegExp(`\\[${escapeRegExp(colName)}\\]`, 'g');
            result = result.replace(colPattern, numericValue.toString());
          });
          
          // Remove all remaining [TABLE.COLUMN] patterns that weren't replaced
          // This handles cases where columns aren't in sourceColumns
          result = result.replace(/\[[^\]]+\]/g, '0');
          
          console.log('Parsed formula:', result);
          
          // Use a safer approach than eval
          try {
            // For simple arithmetic only
            // In production, use a proper formula parser library
            return evaluateSimpleFormula(result);
          } catch (error) {
            console.error('Formula calculation error:', error);
            return 'Error';
          }
        }
        default:
          return 'N/A';
      }
    } catch (error) {
      console.error('Error calculating custom column:', error);
      return 'Error';
    }
  };
  
  // Helper to escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Simple formula evaluator that handles basic arithmetic
  const evaluateSimpleFormula = (formula: string): number => {
    // Log the original formula for debugging
    console.log('Original formula:', formula);
    
    try {
      // Remove any characters that aren't numbers, operators, or decimal points
      const sanitizedFormula = formula.replace(/[^0-9+\-*/().]/g, '');
      
      // Log the sanitized formula
      console.log('Sanitized formula:', sanitizedFormula);
      
      // Check if formula is empty after sanitization
      if (!sanitizedFormula) return 0;
      
      // If formula contains only digits and operations, evaluate it directly
      if (/^[0-9+\-*/().]+$/.test(sanitizedFormula)) {
        // Wrap the evaluation in a try/catch to handle any parsing errors
        try {
          // Use a safer approach than Function for demo purposes
          // Add 0 to force a numeric result
          return Number(new Function(`"use strict"; return (${sanitizedFormula}) + 0`)());
        } catch (e) {
          console.error('Formula evaluation error (direct):', e);
          return 0;
        }
      } else {
        console.error('Invalid formula syntax after sanitization');
        return 0;
      }
    } catch (e) {
      console.error('Formula pre-processing error:', e);
      return 0;
    }
  };

  const columns = useMemo(() => {
    if (!data) return [];
    
    const dataColumns = data.columns.map(column => ({
      Header: column,
      accessor: (row: any) => row[column],
      id: column,
      width: 150
    }));
    
    // Add custom formula columns
    const formulaColumns = customColumns.map(customCol => ({
      Header: customCol.name,
      id: `formula_${customCol.name}`,
      accessor: (row: any) => calculateCustomColumnValue(row, customCol),
      width: 150
    }));
    
    return [...dataColumns, ...formulaColumns];
  }, [data, customColumns]);

  const tableData = useMemo(() => {
    if (!data) return []
    return data.rows
  }, [data])

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      // Format numbers with commas for thousands and up to 2 decimal places
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
    },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder,
    useSortBy
  ) as any;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    allColumns,
    state
  } = tableInstance

  const handleDragOver = (e: React.DragEvent) => {
    if (isReportBuilder) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    if (!isReportBuilder) return;
    
    e.preventDefault();
    
    try {
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // Check if this column is already in the list
      const isAlreadyAdded = draggedColumns.some(item => 
        item.column.name === droppedData.column.name && item.tableName === droppedData.table
      );
      
      if (!isAlreadyAdded) {
        // Add the column to our list
        setDraggedColumns(prev => [
          ...prev, 
          { 
            column: droppedData.column, 
            tableName: droppedData.table,
            alias: droppedData.column.name,
            selected: true
          }
        ]);
      }
    } catch (err) {
      console.error('Error processing dropped item:', err);
    }
  };
  
  const removeColumn = (index: number) => {
    setDraggedColumns(prev => prev.filter((_, i) => i !== index));
  };

  const generateSqlQuery = (columns: DraggedColumn[]) => {
    if (columns.length === 0) {
      setSqlQuery(`SELECT * FROM ${tableName} LIMIT 100`);
      return;
    }

    // Group columns by table
    const tableColumns = columns.reduce<Record<string, Column[]>>((acc, { tableName, column }) => {
      if (!acc[tableName]) {
        acc[tableName] = [];
      }
      acc[tableName].push(column);
      return acc;
    }, {});

    // Build column list
    const columnList = columns.map(
      ({ tableName, column }) => `${tableName}.${column.name}`
    ).join(', ');

    // Build from clause with joins
    const tables = Object.keys(tableColumns);
    let fromClause = `${tables[0]}`;
    
    // If we have multiple tables, try to find join conditions
    if (tables.length > 1) {
      for (let i = 1; i < tables.length; i++) {
        const currentTable = tables[i];
        const previousTable = tables[i - 1];
        
        // Find foreign keys between tables
        const fkColumns = tableColumns[currentTable].filter(col => col.isForeignKey);
        
        if (fkColumns.length > 0) {
          // For simplicity, just use the first FK relationship found
          const fk = fkColumns[0];
          fromClause += ` JOIN ${currentTable} ON ${previousTable}.${fk.references?.column || 'id'} = ${currentTable}.${fk.name}`;
        } else {
          // If no FK relationship found, add a note for the user to specify the join
          fromClause += ` JOIN ${currentTable} ON /* TODO: Specify join condition */`;
        }
      }
    }

    setSqlQuery(`SELECT ${columnList} FROM ${fromClause} LIMIT 100`);
  };

  const fetchReportData = async (columns: DraggedColumn[]) => {
    if (columns.length === 0) return;
    
    // Group columns by table for easier processing
    const tableColumns = columns.reduce<Record<string, Column[]>>((acc, { tableName, column }) => {
      if (!acc[tableName]) {
        acc[tableName] = [];
      }
      acc[tableName].push(column);
      return acc;
    }, {});
    
    // Get unique tables
    const tables = Object.keys(tableColumns);

    // For debugging - let's see what we're searching for
    console.log('Tables in report:', tables);
    
    // Build SQL query with proper join conditions
    let sqlQuery = '';
    
    // Build the column list with schema prefix
    const schemaPrefix = connection.schema ? `${connection.schema}.` : '';
    const columnList = columns.map(({ tableName, column }) => 
      `${schemaPrefix}${tableName}.${column.name}`
    ).join(', ');
    
    // Build FROM clause with JOIN conditions - include schema prefix
    let fromClause = '';
    
    // Add tables with join conditions
    if (tables.includes('CUSTOMERS')) {
      fromClause = `${schemaPrefix}CUSTOMERS`;
      
      if (tables.includes('ORDERS')) {
        fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}CUSTOMERS.CUSTOMER_ID = ${schemaPrefix}ORDERS.CUSTOMER_ID`;
      }
      
      if (tables.includes('ORDER_ITEMS')) {
        if (!tables.includes('ORDERS')) {
          fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}CUSTOMERS.CUSTOMER_ID = ${schemaPrefix}ORDERS.CUSTOMER_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}ORDERS.ORDER_ID = ${schemaPrefix}ORDER_ITEMS.ORDER_ID`;
      }
      
      if (tables.includes('PRODUCTS')) {
        if (!tables.includes('ORDER_ITEMS')) {
          if (!tables.includes('ORDERS')) {
            fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}CUSTOMERS.CUSTOMER_ID = ${schemaPrefix}ORDERS.CUSTOMER_ID`;
          }
          fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}ORDERS.ORDER_ID = ${schemaPrefix}ORDER_ITEMS.ORDER_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}PRODUCTS ON ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID = ${schemaPrefix}PRODUCTS.PRODUCT_ID`;
      }
    } else if (tables.includes('ORDERS')) {
      fromClause = `${schemaPrefix}ORDERS`;
      
      if (tables.includes('CUSTOMERS')) {
        fromClause += ` JOIN ${schemaPrefix}CUSTOMERS ON ${schemaPrefix}ORDERS.CUSTOMER_ID = ${schemaPrefix}CUSTOMERS.CUSTOMER_ID`;
      }
      
      if (tables.includes('ORDER_ITEMS')) {
        fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}ORDERS.ORDER_ID = ${schemaPrefix}ORDER_ITEMS.ORDER_ID`;
      }
      
      if (tables.includes('PRODUCTS')) {
        if (!tables.includes('ORDER_ITEMS')) {
          fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}ORDERS.ORDER_ID = ${schemaPrefix}ORDER_ITEMS.ORDER_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}PRODUCTS ON ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID = ${schemaPrefix}PRODUCTS.PRODUCT_ID`;
      }
    } else if (tables.includes('PRODUCTS')) {
      fromClause = `${schemaPrefix}PRODUCTS`;
      
      if (tables.includes('ORDER_ITEMS')) {
        fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}PRODUCTS.PRODUCT_ID = ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID`;
      }
      
      if (tables.includes('ORDERS')) {
        if (!tables.includes('ORDER_ITEMS')) {
          fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}PRODUCTS.PRODUCT_ID = ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}ORDER_ITEMS.ORDER_ID = ${schemaPrefix}ORDERS.ORDER_ID`;
      }
      
      if (tables.includes('CUSTOMERS')) {
        if (!tables.includes('ORDERS')) {
          if (!tables.includes('ORDER_ITEMS')) {
            fromClause += ` JOIN ${schemaPrefix}ORDER_ITEMS ON ${schemaPrefix}PRODUCTS.PRODUCT_ID = ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID`;
          }
          fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}ORDER_ITEMS.ORDER_ID = ${schemaPrefix}ORDERS.ORDER_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}CUSTOMERS ON ${schemaPrefix}ORDERS.CUSTOMER_ID = ${schemaPrefix}CUSTOMERS.CUSTOMER_ID`;
      }
    } else if (tables.includes('ORDER_ITEMS')) {
      fromClause = `${schemaPrefix}ORDER_ITEMS`;
      
      if (tables.includes('ORDERS')) {
        fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}ORDER_ITEMS.ORDER_ID = ${schemaPrefix}ORDERS.ORDER_ID`;
      }
      
      if (tables.includes('PRODUCTS')) {
        fromClause += ` JOIN ${schemaPrefix}PRODUCTS ON ${schemaPrefix}ORDER_ITEMS.PRODUCT_ID = ${schemaPrefix}PRODUCTS.PRODUCT_ID`;
      }
      
      if (tables.includes('CUSTOMERS')) {
        if (!tables.includes('ORDERS')) {
          fromClause += ` JOIN ${schemaPrefix}ORDERS ON ${schemaPrefix}ORDER_ITEMS.ORDER_ID = ${schemaPrefix}ORDERS.ORDER_ID`;
        }
        fromClause += ` JOIN ${schemaPrefix}CUSTOMERS ON ${schemaPrefix}ORDERS.CUSTOMER_ID = ${schemaPrefix}CUSTOMERS.CUSTOMER_ID`;
      }
    }
    
    // Complete SQL query
    sqlQuery = `SELECT ${columnList} FROM ${fromClause} LIMIT 100`;
    setSqlQuery(sqlQuery);
    
    setLoading(true);
    
    try {
      const result = await executeQuery(sqlQuery, connection);
      console.log('Query result:', result);
      setData(result);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching report data:', error);
      setError(error.message || 'Failed to load report data');
      
      // Fallback to mock data for development
      try {
        let mockResult: Record<string, any>[] = [];
        
        // Generate mock data based on requested tables
        if (tables.includes('CUSTOMERS')) {
          // Start with customers
          mockResult = mockCustomersData.rows.map(customer => {
            const record: Record<string, any> = {};
            Object.keys(customer).forEach(key => {
              record[`CUSTOMERS.${key}`] = customer[key];
            });
            return record;
          });
          
          // Add orders data if needed
          if (tables.includes('ORDERS')) {
            // Join with orders based on customer_id
            mockResult = mockResult.map(customerRecord => {
              const customerOrders = mockOrdersData.rows.filter(
                order => order.CUSTOMER_ID === customerRecord['CUSTOMERS.CUSTOMER_ID']
              );
              
              // If no orders, just return the customer record
              if (!customerOrders.length) return customerRecord;
              
              // Return multiple records, one for each order
              return customerOrders.map(order => {
                const joinedRecord = { ...customerRecord };
                Object.keys(order).forEach(key => {
                  joinedRecord[`ORDERS.${key}`] = order[key];
                });
                return joinedRecord;
              })[0]; // Just take the first order for simplicity
            });
          }
          
          // Add order items if needed
          if (tables.includes('ORDER_ITEMS')) {
            // Add order items data
            mockResult = mockResult.flatMap(record => {
              if (!record['ORDERS.ORDER_ID']) return record;
              
              const orderItems = mockOrderItemsData.rows.filter(
                item => item.ORDER_ID === record['ORDERS.ORDER_ID']
              );
              
              if (!orderItems.length) return record;
              
              // Return multiple records, one for each order item
              return orderItems.map(item => {
                const joinedRecord = { ...record };
                Object.keys(item).forEach(key => {
                  joinedRecord[`ORDER_ITEMS.${key}`] = item[key];
                });
                return joinedRecord;
              })[0]; // Just take the first item for simplicity
            });
          }
          
          // Add products if needed
          if (tables.includes('PRODUCTS')) {
            // Add products data
            mockResult = mockResult.map(record => {
              if (!record['ORDER_ITEMS.PRODUCT_ID']) return record;
              
              const product = mockProductsData.rows.find(
                p => p.PRODUCT_ID === record['ORDER_ITEMS.PRODUCT_ID']
              );
              
              if (!product) return record;
              
              const joinedRecord = { ...record };
              Object.keys(product).forEach(key => {
                joinedRecord[`PRODUCTS.${key}`] = product[key];
              });
              return joinedRecord;
            });
          }
        } else if (tables.includes('ORDERS')) {
          // Start with orders if no customers
          mockResult = mockOrdersData.rows.map(order => {
            const record: Record<string, any> = {};
            Object.keys(order).forEach(key => {
              record[`ORDERS.${key}`] = order[key];
            });
            return record;
          });
          
          // Add customers if needed
          if (tables.includes('CUSTOMERS')) {
            mockResult = mockResult.map(orderRecord => {
              const customer = mockCustomersData.rows.find(
                c => c.CUSTOMER_ID === orderRecord['ORDERS.CUSTOMER_ID']
              );
              
              if (!customer) return orderRecord;
              
              const joinedRecord = { ...orderRecord };
              Object.keys(customer).forEach(key => {
                joinedRecord[`CUSTOMERS.${key}`] = customer[key];
              });
              return joinedRecord;
            });
          }
          
          // Add order items if needed
          if (tables.includes('ORDER_ITEMS')) {
            mockResult = mockResult.flatMap(record => {
              const orderItems = mockOrderItemsData.rows.filter(
                item => item.ORDER_ID === record['ORDERS.ORDER_ID']
              );
              
              if (!orderItems.length) return record;
              
              return orderItems.map(item => {
                const joinedRecord = { ...record };
                Object.keys(item).forEach(key => {
                  joinedRecord[`ORDER_ITEMS.${key}`] = item[key];
                });
                return joinedRecord;
              })[0]; // Just take the first one for simplicity
            });
          }
          
          // Add products if needed
          if (tables.includes('PRODUCTS') && tables.includes('ORDER_ITEMS')) {
            mockResult = mockResult.map(record => {
              if (!record['ORDER_ITEMS.PRODUCT_ID']) return record;
              
              const product = mockProductsData.rows.find(
                p => p.PRODUCT_ID === record['ORDER_ITEMS.PRODUCT_ID']
              );
              
              if (!product) return record;
              
              const joinedRecord = { ...record };
              Object.keys(product).forEach(key => {
                joinedRecord[`PRODUCTS.${key}`] = product[key];
              });
              return joinedRecord;
            });
          }
        } else if (tables.includes('PRODUCTS')) {
          // Use products as base if no customers or orders
          mockResult = mockProductsData.rows.map(product => {
            const record: Record<string, any> = {};
            Object.keys(product).forEach(key => {
              record[`PRODUCTS.${key}`] = product[key];
            });
            return record;
          });
        } else if (tables.includes('ORDER_ITEMS')) {
          // Use order items as base if no other tables
          mockResult = mockOrderItemsData.rows.map(item => {
            const record: Record<string, any> = {};
            Object.keys(item).forEach(key => {
              record[`ORDER_ITEMS.${key}`] = item[key];
            });
            return record;
          });
        }
        
        // Filter to only include the columns that were requested
        const columnIdentifiers = columns.map(col => `${col.tableName}.${col.column.name}`);
        
        // Set data with fully joined result
        setData({
          columns: columnIdentifiers,
          rows: mockResult,
          totalRows: mockResult.length,
          queryId: 'mock-report-query'
        });
        setError(null);
      } catch (mockError: any) {
        console.error('Error creating mock data:', mockError);
        setError('Failed to generate report data');
      }
    } finally {
      setLoading(false);
    }
  };

  const addCustomColumn = () => {
    if (!newFormula.name || (!newFormula.formula && newFormula.type === 'CUSTOM') || (newFormula.sourceColumns || []).length === 0) {
      alert("Please complete all fields: column name, formula (for custom type), and select at least one source column.");
      return;
    }
    
    const newCustomColumn: CustomColumn = {
      name: newFormula.name || 'Custom Column',
      formula: newFormula.formula || '',
      type: newFormula.type || 'CUSTOM',
      sourceColumns: newFormula.sourceColumns || []
    };
    
    setCustomColumns(prev => [...prev, newCustomColumn]);
    setNewFormula({
      name: '',
      formula: '',
      type: 'CUSTOM',
      sourceColumns: []
    });
    setShowFormulaModal(false);
  };

  // Handle column dragging for reordering
  const handleColumnDragStart = (index: number) => {
    dragColumnRef.current = index;
  };

  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    // Don't do anything if we're dragging over the same column
    if (dragColumnRef.current === index) return;
  };

  const handleColumnDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (dragColumnRef.current === null) return;
    
    const draggedColumnIndex = dragColumnRef.current;
    const currentColumnOrder = [...allColumns.map((col: any) => col.id)];
    
    // Remove the dragged column from the array
    const draggedColumn = currentColumnOrder.splice(draggedColumnIndex, 1)[0];
    
    // Insert the dragged column at the new position
    currentColumnOrder.splice(index, 0, draggedColumn);
    
    // Update the column order
    setColumnOrder(currentColumnOrder);
    
    // Reset the dragged column ref
    dragColumnRef.current = null;
  };

  // Helper to get mock data for a specific table
  const getMockDataForTable = (tableName: string): any => {
    // Extract the table name without schema
    const parts = tableName.split('.');
    const baseTableName = parts[parts.length - 1];
    
    switch (baseTableName) {
      case 'CUSTOMERS':
        return mockCustomersData;
      case 'ORDERS':
        return mockOrdersData;
      case 'PRODUCTS':
        return mockProductsData;
      case 'ORDER_ITEMS':
        return mockOrderItemsData;
      default:
        return {
          columns: ['NO_DATA'],
          rows: [{ NO_DATA: 'No data available for this table' }],
          totalRows: 1,
          queryId: 'mock-empty'
        };
    }
  };

  // Handle report data fetching using the dropped columns
  useEffect(() => {
    if (isReportBuilder && draggedColumns.length > 0) {
      // Build SQL query from dragged columns
      const selectedColumns = draggedColumns
        .filter(col => col.selected)
        .map(col => {
          const tableParts = col.tableName.split('.');
          const formattedTable = tableParts.length > 1 
            ? `"${tableParts[0]}"."${tableParts[1]}"`
            : `"${col.tableName}"`;
          return `${formattedTable}."${col.column.name}" as "${col.alias || col.column.name}"`;
        });
      
      if (selectedColumns.length === 0) {
        setSqlQuery('');
        setData(null);
        return;
      }
      
      // Extract table names from columns
      const tablesSet = new Set(draggedColumns.map(col => col.tableName));
      const tables = Array.from(tablesSet);
      const query = `SELECT ${selectedColumns.join(', ')} FROM ${tables[0]} LIMIT 1000`;
      
      setSqlQuery(query);
      
      // Execute the query - for now just use mock data based on the first table
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Get mock data based on the first table in the query
          const firstTable = tables[0].split('.').pop() || '';
          const mockData = getMockDataForTable(firstTable);
          
          if (mockData) {
            // Filter to only include columns that were selected
            const selectedColumnNames = draggedColumns
              .filter(col => col.selected)
              .map(col => col.column.name);
            
            // Create a subset of the mock data with only the selected columns
            const filteredData = {
              columns: mockData.columns.filter((col: string) => selectedColumnNames.includes(col)),
              rows: mockData.rows.map((row: Record<string, any>) => {
                const filteredRow: Record<string, any> = {};
                selectedColumnNames.forEach(colName => {
                  if (colName in row) {
                    filteredRow[colName] = row[colName];
                  }
                });
                return filteredRow;
              }),
              totalRows: mockData.totalRows,
              queryId: `report-${Date.now()}`
            };
            
            setData(filteredData);
          } else {
            setData(null);
          }
        } catch (err: any) {
          console.error('Error generating report:', err);
          setError(err.message || 'Failed to generate report');
        } finally {
          setLoading(false);
        }
      }, 500);
    }
  }, [isReportBuilder, draggedColumns]);

  // Handle adding a column as a group by column
  const addGroupByColumn = (columnName: string) => {
    if (!groupByColumns.includes(columnName)) {
      setGroupByColumns(prev => [...prev, columnName]);
    }
  };

  // Handle removing a column from group by
  const removeGroupByColumn = (columnName: string) => {
    setGroupByColumns(prev => prev.filter(col => col !== columnName));
  };

  // Set aggregation function for a column
  const setAggregationForColumn = (columnName: string, aggregation: string) => {
    setAggregationFunctions(prev => ({
      ...prev,
      [columnName]: aggregation
    }));
  };

  // Toggle grouping mode
  const toggleGroupingMode = () => {
    setGroupingMode(!groupingMode);
    
    // If turning off grouping mode, clear groupings
    if (groupingMode) {
      setGroupByColumns([]);
      setAggregationFunctions({});
    }
  };

  // Effect to apply grouping
  useEffect(() => {
    if (!data || groupByColumns.length === 0) return;
    
    // If we have groupings applied, compute the grouped data
    if (groupingMode && groupByColumns.length > 0) {
      try {
        setLoading(true);
        
        // Group the data by the selected columns
        const groupedData = groupDataByColumns(data.rows, groupByColumns, aggregationFunctions);
        
        // Update the data with the grouped result
        setData({
          columns: [...groupByColumns, ...Object.keys(aggregationFunctions)],
          rows: groupedData,
          totalRows: groupedData.length,
          queryId: `grouped-${Date.now()}`
        });
      } catch (err: any) {
        console.error('Error applying grouping:', err);
        setError(err.message || 'Failed to apply grouping');
      } finally {
        setLoading(false);
      }
    }
  }, [groupingMode, groupByColumns, aggregationFunctions, data?.queryId]);

  // Function to group data by columns
  const groupDataByColumns = (
    rows: Record<string, any>[], 
    groupCols: string[], 
    aggregations: Record<string, string>
  ): Record<string, any>[] => {
    // Create a map for our grouped data
    const groupedMap = new Map();
    
    // Process each row
    rows.forEach(row => {
      // Create a key based on the group by columns
      const groupKey = groupCols.map(col => row[col]).join('||');
      
      if (!groupedMap.has(groupKey)) {
        // Initialize a new group
        const newGroup: Record<string, any> = {};
        
        // Add the group by columns
        groupCols.forEach(col => {
          newGroup[col] = row[col];
        });
        
        // Initialize aggregations
        Object.entries(aggregations).forEach(([col, agg]) => {
          if (agg === 'COUNT') {
            newGroup[col] = 1;
          } else if (agg === 'SUM' || agg === 'AVG') {
            newGroup[col] = typeof row[col] === 'number' ? row[col] : 0;
          } else if (agg === 'MIN') {
            newGroup[col] = row[col];
          } else if (agg === 'MAX') {
            newGroup[col] = row[col];
          }
        });
        
        // Store count for averages
        newGroup['__count'] = 1;
        
        groupedMap.set(groupKey, newGroup);
      } else {
        // Update existing group
        const existingGroup = groupedMap.get(groupKey);
        
        // Update aggregations
        Object.entries(aggregations).forEach(([col, agg]) => {
          if (agg === 'COUNT') {
            existingGroup[col] += 1;
          } else if (agg === 'SUM' || agg === 'AVG') {
            existingGroup[col] += (typeof row[col] === 'number' ? row[col] : 0);
          } else if (agg === 'MIN') {
            if (row[col] < existingGroup[col]) {
              existingGroup[col] = row[col];
            }
          } else if (agg === 'MAX') {
            if (row[col] > existingGroup[col]) {
              existingGroup[col] = row[col];
            }
          }
        });
        
        // Increment count for averages
        existingGroup['__count'] += 1;
      }
    });
    
    // Process final aggregations (like AVG that need post-processing)
    const result = Array.from(groupedMap.values()).map(group => {
      const finalGroup = { ...group };
      
      // Calculate averages
      Object.entries(aggregations).forEach(([col, agg]) => {
        if (agg === 'AVG') {
          finalGroup[col] = finalGroup[col] / finalGroup['__count'];
        }
      });
      
      // Remove the count property
      delete finalGroup['__count'];
      
      return finalGroup;
    });
    
    return result;
  };

  // Column menu options - extended with grouping, formatting, etc.
  const renderColumnMenu = (column: any) => {
    return (
      <div className="absolute right-0 mt-8 bg-white border border-gray-200 rounded shadow-lg z-20 w-48">
        <div className="p-2 border-b border-gray-200">
          <div className="text-xs font-medium text-gray-700">{column.id}</div>
        </div>
        <div className="py-1">
          <button
            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => {
              const newOrder = allColumns.map((col: any) => col.id);
              newOrder.sort((a: string, b: string) => {
                if (a === column.id) return -1;
                if (b === column.id) return 1;
                return 0;
              });
              setColumnOrder(newOrder);
            }}
          >
            Move to front
          </button>
          
          {groupingMode ? (
            <>
              {!groupByColumns.includes(column.id) ? (
                <button
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => addGroupByColumn(column.id)}
                >
                  Group by this column
                </button>
              ) : (
                <button
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => removeGroupByColumn(column.id)}
                >
                  Remove from grouping
                </button>
              )}
              
              {!groupByColumns.includes(column.id) && (
                <div className="relative">
                  <button
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Aggregate</span>
                    <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                  </button>
                  <div className="absolute left-full top-0 bg-white border border-gray-200 rounded shadow-lg w-32">
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setAggregationForColumn(column.id, 'SUM')}
                    >
                      Sum
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setAggregationForColumn(column.id, 'AVG')}
                    >
                      Average
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setAggregationForColumn(column.id, 'MIN')}
                    >
                      Minimum
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setAggregationForColumn(column.id, 'MAX')}
                    >
                      Maximum
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setAggregationForColumn(column.id, 'COUNT')}
                    >
                      Count
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
          
          <button
            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Add logic to create a custom formula column based on this column
              setShowFormulaModal(true);
              setNewFormula({
                name: `${column.id}_calc`,
                formula: `[${column.id}]`,
                type: 'CUSTOM',
                sourceColumns: [column.id]
              });
            }}
          >
            Create formula from column
          </button>
          
          <button
            className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Add filter by this column logic
              // This would typically open a filter dialog or add a filter
              console.log('Filter by column:', column.id);
            }}
          >
            Filter by this column
          </button>
        </div>
      </div>
    );
  };

  // Toggle column menu
  const toggleColumnMenu = (columnId: string) => {
    if (activeColumnMenu === columnId) {
      setActiveColumnMenu(null);
    } else {
      setActiveColumnMenu(columnId);
    }
  };

  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveColumnMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    )
  }

  if (isReportBuilder) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden">
        {/* Premium Report Builder Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <h3 className="text-base font-semibold text-gray-800">Report Builder</h3>
              <div className="ml-4 flex items-center space-x-2">
                <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 text-xs font-medium rounded border border-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Visualization
                </button>
                <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded border border-gray-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Layout
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                More
              </button>
            </div>
          </div>
        </div>
        
        {/* Column Selection Area */}
        <div className="grid grid-cols-12 flex-1 overflow-hidden">
          {/* Column Drop Area - 30% width */}
          <div className="col-span-4 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-white">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Columns</h4>
              <p className="text-xs text-gray-500 mb-3">
                Drag columns from the sidebar and drop them here to build your report.
              </p>
              
              {/* Column Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search columns..."
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 pl-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Dragged Columns Area */}
            <div 
              className="flex-1 overflow-y-auto p-2"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {draggedColumns.length > 0 ? (
                <div className="space-y-2">
                  {draggedColumns.map((item, index) => (
                    <div 
                      key={`${item.tableName}.${item.column.name}-${index}`}
                      className="bg-white border border-gray-200 rounded shadow-sm"
                    >
                      <div className="flex items-center justify-between py-2 px-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <span className="text-xs font-medium text-gray-700">{item.tableName.split('.').pop()}.{item.column.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{item.column.type}</span>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => removeColumn(index)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center space-x-2">
                          <select className="text-xs border border-gray-200 rounded p-1 bg-gray-50 text-gray-700 w-24">
                            <option>Raw Value</option>
                            <option>Sum</option>
                            <option>Average</option>
                            <option>Count</option>
                            <option>Min</option>
                            <option>Max</option>
                          </select>
                          <input 
                            type="text" 
                            placeholder="Rename"
                            className="text-xs border border-gray-200 rounded p-1 flex-1"
                            value={item.alias || item.column.name}
                            onChange={(e) => {
                              const newDraggedColumns = [...draggedColumns];
                              newDraggedColumns[index].alias = e.target.value;
                              setDraggedColumns(newDraggedColumns);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm font-medium">Drop columns here</p>
                    <p className="text-gray-400 text-xs mt-1">Drag columns from the sidebar to start building your report</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Data Preview Area - 70% width */}
          <div className="col-span-8 flex flex-col overflow-hidden">
            {/* SQL Query */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-800">SQL Query</h4>
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit SQL</button>
              </div>
              {sqlQuery ? (
                <div className="bg-white border border-gray-200 rounded p-2 text-xs font-mono text-gray-800 overflow-x-auto whitespace-pre">
                  <span className="text-purple-600">SELECT</span> {sqlQuery.includes('SELECT') ? sqlQuery.split('SELECT')[1].split('FROM')[0] : '*'} 
                  <span className="text-purple-600"> FROM</span> {sqlQuery.includes('FROM') ? sqlQuery.split('FROM')[1].split('LIMIT')[0] : ''} 
                  <span className="text-purple-600"> LIMIT</span> {sqlQuery.includes('LIMIT') ? sqlQuery.split('LIMIT')[1] : '1000'}
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-200 rounded p-2 text-xs text-gray-500 italic">
                  No query generated yet. Add columns to build your query.
                </div>
              )}
            </div>
            
            {/* Data Preview */}
            <div className="flex-1 overflow-auto">
              {data && data.rows.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {data.columns.map((column) => (
                        <th
                          key={column}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {data.columns.map((column) => (
                          <td 
                            key={`${rowIndex}-${column}`} 
                            className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 border-b border-gray-100"
                          >
                            {row[column] !== null && row[column] !== undefined 
                              ? String(row[column]) 
                              : <span className="text-gray-300">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {draggedColumns.length > 0 ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm font-medium">No data found for this selection</p>
                        <p className="text-gray-400 text-xs mt-1">Try selecting different columns or tables</p>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <p className="text-gray-500 text-sm font-medium">No data to display</p>
                        <p className="text-gray-400 text-xs mt-1">Drag columns from the sidebar to see data</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full w-full flex flex-col bg-white overflow-hidden" 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Enhanced toolbar with more analytical features */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-800 px-2">{tableName || "Report Builder"}</span>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <span className="text-xs text-gray-500 px-2">{data?.totalRows} rows</span>
          
          {/* Additional tools */}
          <div className="ml-4 flex items-center space-x-1">
            {/* Data Refresh Button */}
            <button
              className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 focus:outline-none flex items-center"
              title="Refresh data"
              onClick={() => fetchReportData(draggedColumns)}
            >
              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Refresh</span>
            </button>
            
            {/* Formula Button */}
            <button
              className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 focus:outline-none flex items-center"
              title="Add formula column"
              onClick={() => setShowFormulaModal(true)}
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Add Formula</span>
            </button>
            
            {/* Grouping Button */}
            <button
              className={`p-1 rounded focus:outline-none flex items-center ${
                groupingMode 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={groupingMode ? "Exit Grouping Mode" : "Enter Grouping Mode"}
              onClick={toggleGroupingMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-xs">Group</span>
              {groupingMode && <span className="ml-1 text-xs font-medium text-blue-700">ON</span>}
            </button>
            
            {/* Filter Button */}
            <button
              className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 focus:outline-none flex items-center"
              title="Filter data"
            >
              <FunnelIcon className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pr-2">
          {/* View options */}
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button className="px-2 py-1 text-xs bg-blue-50 text-blue-600 font-medium border-r border-gray-300">
              Table
            </button>
            <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
              Chart
            </button>
            <button className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-50">
              Pivot
            </button>
          </div>
          
          {/* Share button */}
          <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Dragged columns display - improved styling */}
      {draggedColumns.length > 0 && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-blue-50 flex-wrap">
          <span className="text-xs font-medium text-gray-700 mr-2">Selected columns:</span>
          {draggedColumns.map((col, index) => (
            <div 
              key={`${col.tableName}-${col.column.name}-${index}`}
              className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-200 text-xs shadow-sm"
            >
              <span className="text-gray-800 font-medium">{col.tableName.split('.').pop()}.{col.column.name}</span>
              <button 
                onClick={() => removeColumn(index)}
                className="text-gray-400 hover:text-gray-600 ml-1"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Address bar - improved with syntax highlighting */}
      <div className="flex items-center p-2 border-b border-gray-200 bg-gray-50">
        <div className="flex-1 flex items-center">
          <div className="text-xs mr-2 font-medium text-gray-700">SQL:</div>
          <div className="bg-white border border-gray-300 px-3 py-1.5 text-xs rounded text-gray-800 font-mono overflow-x-auto whitespace-nowrap w-full max-w-full shadow-sm">
            <span className="text-purple-600">SELECT</span> {sqlQuery.includes('SELECT') ? sqlQuery.split('SELECT')[1].split('FROM')[0] : '*'} 
            <span className="text-purple-600"> FROM</span> {sqlQuery.includes('FROM') ? sqlQuery.split('FROM')[1].split('LIMIT')[0] : tableName} 
            <span className="text-purple-600"> LIMIT</span> {sqlQuery.includes('LIMIT') ? sqlQuery.split('LIMIT')[1] : '1000'}
          </div>
        </div>
        <button className="ml-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded">
          Edit SQL
        </button>
      </div>

      {/* Grouping bar - show active groupings */}
      {groupingMode && (
        <div className="flex items-center p-2 border-b border-gray-200 bg-green-50">
          <div className="text-xs font-medium text-green-800 mr-2">
            Grouping Mode:
          </div>
          {groupByColumns.length > 0 ? (
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-xs text-gray-600 mr-1">Grouped by:</span>
              {groupByColumns.map((col) => (
                <div 
                  key={col}
                  className="flex items-center text-xs bg-white border border-green-300 rounded px-2 py-0.5"
                >
                  <span className="text-green-800 font-medium">{col}</span>
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => removeGroupByColumn(col)}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-600">
              Right-click on column headers to add groupings or aggregations
            </div>
          )}
          
          {Object.keys(aggregationFunctions).length > 0 && (
            <div className="flex items-center ml-4 flex-wrap gap-1">
              <span className="text-xs text-gray-600 mr-1">Aggregations:</span>
              {Object.entries(aggregationFunctions).map(([col, func]) => (
                <div 
                  key={col}
                  className="flex items-center text-xs bg-white border border-blue-300 rounded px-2 py-0.5"
                >
                  <span className="text-blue-800 font-medium">{func}({col})</span>
                  <button
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setAggregationFunctions(prev => {
                        const newAggs = { ...prev };
                        delete newAggs[col];
                        return newAggs;
                      });
                    }}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Spreadsheet - enhanced with better styling */}
      <div className={`flex-1 overflow-auto ${isDraggingOver ? 'bg-blue-50' : ''}`}>
        <table {...getTableProps()} className="min-w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {headerGroups.map((headerGroup: HeaderGroup<object>, i: number) => {
              const hgProps = headerGroup.getHeaderGroupProps();
              return (
                <tr key={`header-group-${i}`} role={hgProps.role} style={hgProps.style} className={hgProps.className}>
                  {headerGroup.headers.map((column: any, index: number) => {
                    const headerProps = column.getHeaderProps(column.getSortByToggleProps());
                    const isCustomHeader = column.id.startsWith('formula_');
                    const isGroupedColumn = groupByColumns.includes(column.id);
                    
                    return (
                      <th
                        key={headerProps.key}
                        className={`px-3 py-2 text-left text-xs font-medium border-b border-r border-gray-300 select-none cursor-pointer hover:bg-gray-100 whitespace-nowrap relative ${
                          isCustomHeader 
                            ? 'bg-blue-50 text-blue-800' 
                            : isGroupedColumn 
                              ? 'bg-green-50 text-green-800' 
                              : 'bg-gray-50 text-gray-700'
                        }`}
                        style={{ height: '32px', ...headerProps.style }}
                        onClick={(e) => {
                          e.stopPropagation();
                          headerProps.onClick(e);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleColumnMenu(column.id);
                        }}
                        draggable
                        onDragStart={() => handleColumnDragStart(index)}
                        onDragOver={(e) => handleColumnDragOver(e, index)}
                        onDrop={(e) => handleColumnDrop(e, index)}
                      >
                        <div className="flex items-center">
                          {isGroupedColumn && (
                            <div className="mr-1 bg-green-100 text-green-800 text-xs px-1 rounded-sm">G</div>
                          )}
                          <span className="truncate">
                            {column.render('Header')}
                            {isCustomHeader && <span className="ml-1 text-xs text-blue-500">(formula)</span>}
                          </span>
                          <span className="ml-1 text-gray-400 flex-shrink-0">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ChevronDownIcon className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronUpIcon className="h-3.5 w-3.5" />
                              )
                            ) : null}
                          </span>
                          <button 
                            className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleColumnMenu(column.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        {/* Column resizer handle - improved visibility */}
                        <div
                          {...column.getResizerProps()}
                          className="absolute right-0 top-0 h-full w-1 bg-gray-300 opacity-0 hover:opacity-100 hover:bg-blue-400 cursor-col-resize"
                        />
                        
                        {/* Column Menu */}
                        {activeColumnMenu === column.id && renderColumnMenu(column)}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<object>, rowIndex: number) => {
                prepareRow(row);
                const rowProps = row.getRowProps();
                return (
                  <tr
                    key={rowProps.key || `row-${rowIndex}`}
                    className={`hover:bg-blue-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    {row.cells.map((cell: Cell<object>) => {
                      const cellProps = cell.getCellProps();
                      const isCustomColumn = cell.column.id.startsWith('formula_');
                      const isNumeric = typeof cell.value === 'number';

                      return (
                        <td
                          key={cellProps.key}
                          className={`px-3 py-2 text-sm border-b border-r border-gray-200 ${
                            isCustomColumn ? 'bg-blue-50' : ''
                          } ${isNumeric ? 'text-right' : 'text-left'}`}
                          style={{ height: '28px', ...cellProps.style }}
                        >
                          {formatCellValue(cell.value)}
                        </td>
                      );
                    })}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td 
                  colSpan={columns.length || 1} 
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Enhanced status bar */}
      <div className="py-2 px-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Query executed in 0.12s</span>
          <span className="text-gray-600">{data?.totalRows} rows</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-800">
            Export CSV
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-blue-600 hover:text-blue-800">
            Create Chart
          </button>
        </div>
      </div>

      {/* Formula Column Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg max-w-md w-full p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Add Formula Column</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Column Name
              </label>
              <input
                type="text"
                className="w-full text-xs border border-gray-300 rounded-md p-1.5 text-gray-800"
                value={newFormula.name}
                onChange={(e) => setNewFormula(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Total Value"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Formula Type
              </label>
              <select
                className="w-full text-xs border border-gray-300 rounded-md p-1.5 text-gray-800"
                value={newFormula.type}
                onChange={(e) => setNewFormula(prev => ({ ...prev, type: e.target.value as CustomColumn['type'] }))}
              >
                <option value="SUM">SUM</option>
                <option value="AVG">AVERAGE</option>
                <option value="COUNT">COUNT</option>
                <option value="MIN">MINIMUM</option>
                <option value="MAX">MAXIMUM</option>
                <option value="CUSTOM">CUSTOM FORMULA</option>
              </select>
            </div>
            
            {newFormula.type === 'CUSTOM' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Formula Expression
                </label>
                <input
                  type="text"
                  className="w-full text-xs border border-gray-300 rounded-md p-1.5 text-gray-800"
                  value={newFormula.formula}
                  onChange={(e) => setNewFormula(prev => ({ ...prev, formula: e.target.value }))}
                  placeholder="e.g., [ORDERS.TOTAL_AMOUNT] * 0.1"
                />
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Quick Examples:</p>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => {
                        if (data && data.columns.length >= 2) {
                          const col1 = data.columns[0];
                          const col2 = data.columns[1];
                          setNewFormula(prev => ({
                            ...prev,
                            formula: `[${col1}] * [${col2}]`,
                            sourceColumns: [...(prev.sourceColumns || []), col1, col2].filter((v, i, a) => a.indexOf(v) === i)
                          }));
                        }
                      }}
                    >
                      Multiply
                    </button>
                    <button
                      type="button"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => {
                        if (data && data.columns.length >= 1) {
                          const col = data.columns[0];
                          setNewFormula(prev => ({
                            ...prev,
                            formula: `[${col}] * 0.1`,
                            sourceColumns: [...(prev.sourceColumns || []), col].filter((v, i, a) => a.indexOf(v) === i)
                          }));
                        }
                      }}
                    >
                      Percentage
                    </button>
                    <button
                      type="button"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => {
                        if (data && data.columns.length >= 2) {
                          const col1 = data.columns[0];
                          const col2 = data.columns[1];
                          setNewFormula(prev => ({
                            ...prev,
                            formula: `[${col1}] / [${col2}]`,
                            sourceColumns: [...(prev.sourceColumns || []), col1, col2].filter((v, i, a) => a.indexOf(v) === i)
                          }));
                        }
                      }}
                    >
                      Division
                    </button>
                    <button
                      type="button"
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => {
                        if (data && data.columns.length >= 2) {
                          const col1 = data.columns[0];
                          const col2 = data.columns[1];
                          setNewFormula(prev => ({
                            ...prev,
                            formula: `[${col1}] + [${col2}]`,
                            sourceColumns: [...(prev.sourceColumns || []), col1, col2].filter((v, i, a) => a.indexOf(v) === i)
                          }));
                        }
                      }}
                    >
                      Addition
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Examples: [ORDERS.TOTAL_AMOUNT] * 0.1 (Tax), [ORDER_ITEMS.QUANTITY] * [PRODUCTS.PRICE] (Line Total)
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Source Columns 
                <span className="text-xs font-normal text-gray-500 ml-1">
                  (select columns to include in calculation)
                </span>
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-1.5">
                {data && data.columns.map((colName: string) => (
                  <div key={colName} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`col-${colName}`}
                      checked={(newFormula.sourceColumns || []).includes(colName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewFormula(prev => ({
                            ...prev,
                            sourceColumns: [...(prev.sourceColumns || []), colName]
                          }));
                        } else {
                          setNewFormula(prev => ({
                            ...prev,
                            sourceColumns: (prev.sourceColumns || []).filter((c: string) => c !== colName)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`col-${colName}`} className="text-xs text-gray-700">{colName}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-2 rounded-md mb-4">
              <p className="text-xs text-blue-800">
                <strong>How it works:</strong> Selected columns will be used in your formula calculation. For custom formulas, reference columns using square brackets: [COLUMN_NAME]
              </p>
            </div>
            
            <div className="flex space-x-2 justify-end">
              <button 
                onClick={() => {
                  setShowFormulaModal(false);
                  setNewFormula({
                    name: '',
                    formula: '',
                    type: 'CUSTOM',
                    sourceColumns: []
                  });
                }}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={addCustomColumn}
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}