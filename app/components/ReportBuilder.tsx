'use client'

import { useState, useCallback, useMemo } from 'react'
import { XMarkIcon, PlusIcon, ArrowPathIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { DatabaseSchema, Column } from '../lib/types'
import { executeQuery } from '../lib/snowflake-client'

interface ReportBuilderProps {
  connection: {
    account: string
    username: string
    database: string
    warehouse: string
    schema?: string
  }
  schema: DatabaseSchema
}

interface DraggedColumn {
  tableName: string
  column: Column
}

interface JoinRelationship {
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
}

export default function ReportBuilder({ connection, schema }: ReportBuilderProps) {
  const [draggedColumns, setDraggedColumns] = useState<DraggedColumn[]>([])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [sqlQuery, setSqlQuery] = useState<string>('')
  const [reportData, setReportData] = useState<any[]>([])
  const [joins, setJoins] = useState<JoinRelationship[]>([
    // Predefined common joins for default handling
    {
      sourceTable: 'CUSTOMERS',
      sourceColumn: 'CUSTOMER_ID',
      targetTable: 'ORDERS',
      targetColumn: 'CUSTOMER_ID'
    },
    {
      sourceTable: 'ORDERS',
      sourceColumn: 'ORDER_ID',
      targetTable: 'ORDER_ITEMS',
      targetColumn: 'ORDER_ID'
    },
    {
      sourceTable: 'PRODUCTS',
      sourceColumn: 'PRODUCT_ID',
      targetTable: 'ORDER_ITEMS',
      targetColumn: 'PRODUCT_ID'
    }
  ])
  const [showJoinPrompt, setShowJoinPrompt] = useState(false)
  const [pendingColumn, setPendingColumn] = useState<DraggedColumn | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Detect tables involved in the current report
  const tablesInReport = useMemo(() => {
    const uniqueTables = new Set<string>();
    draggedColumns.forEach(col => uniqueTables.add(col.tableName));
    return Array.from(uniqueTables);
  }, [draggedColumns]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.type === 'column') {
          const newColumn = {
            tableName: parsedData.tableName,
            column: parsedData.column
          };
          
          // If this is the first column, add it directly
          if (draggedColumns.length === 0) {
            setDraggedColumns([newColumn]);
            generateSqlQuery([newColumn], joins);
            fetchReportData([newColumn], joins);
            return;
          }
          
          // If the table is already in the report, add the column
          if (tablesInReport.includes(parsedData.tableName)) {
            setDraggedColumns(prev => {
              const newColumns = [...prev, newColumn];
              generateSqlQuery(newColumns, joins);
              fetchReportData(newColumns, joins);
              return newColumns;
            });
            return;
          }
          
          // Check if we have a predefined join for this table
          const existingJoin = joins.find(join => 
            (join.sourceTable === parsedData.tableName && tablesInReport.includes(join.targetTable)) ||
            (join.targetTable === parsedData.tableName && tablesInReport.includes(join.sourceTable))
          );
          
          if (existingJoin) {
            // We have a predefined join, use it
            setDraggedColumns(prev => {
              const newColumns = [...prev, newColumn];
              generateSqlQuery(newColumns, joins);
              fetchReportData(newColumns, joins);
              return newColumns;
            });
          } else {
            // Need to define a join relationship
            setPendingColumn(newColumn);
            setShowJoinPrompt(true);
          }
        }
      }
    } catch (err) {
      console.error('Error processing dragged data:', err);
    }
  }, [draggedColumns, tablesInReport, joins]);

  const removeColumn = (index: number) => {
    setDraggedColumns(prev => {
      const newColumns = [...prev];
      newColumns.splice(index, 1);
      generateSqlQuery(newColumns, joins);
      if (newColumns.length > 0) {
        fetchReportData(newColumns, joins);
      } else {
        setReportData([]);
      }
      return newColumns;
    });
  };

  const confirmJoin = (sourceTable: string, sourceColumn: string, targetColumn: string) => {
    if (!pendingColumn) return;
    
    const newJoin = {
      sourceTable,
      sourceColumn,
      targetTable: pendingColumn.tableName,
      targetColumn
    };
    
    const newJoins = [...joins, newJoin];
    const newColumns = [...draggedColumns, pendingColumn];
    
    setJoins(newJoins);
    setDraggedColumns(newColumns);
    setPendingColumn(null);
    setShowJoinPrompt(false);
    
    generateSqlQuery(newColumns, newJoins);
    fetchReportData(newColumns, newJoins);
  };

  const cancelJoin = () => {
    setPendingColumn(null);
    setShowJoinPrompt(false);
  };

  const generateSqlQuery = (columns: DraggedColumn[], joinRelationships: JoinRelationship[]) => {
    if (columns.length === 0) {
      setSqlQuery('');
      return;
    }

    // Build column list
    const columnList = columns.map(
      ({ tableName, column }) => `${tableName}.${column.name}`
    ).join(', ');

    // Build from clause
    const uniqueTables = Array.from(new Set(columns.map(col => col.tableName)));
    let fromClause = uniqueTables[0];
    
    // Add joins if we have multiple tables
    if (uniqueTables.length > 1) {
      const tablesAfterFirst = uniqueTables.slice(1);
      
      for (const table of tablesAfterFirst) {
        // Find a join relationship for this table
        const joinRel = joinRelationships.find(
          join => (join.sourceTable === table && uniqueTables.includes(join.targetTable)) ||
                 (join.targetTable === table && uniqueTables.includes(join.sourceTable))
        );
        
        if (joinRel) {
          if (joinRel.sourceTable === table) {
            fromClause += ` JOIN ${table} ON ${joinRel.sourceTable}.${joinRel.sourceColumn} = ${joinRel.targetTable}.${joinRel.targetColumn}`;
          } else {
            fromClause += ` JOIN ${table} ON ${joinRel.targetTable}.${joinRel.targetColumn} = ${joinRel.sourceTable}.${joinRel.sourceColumn}`;
          }
        } else {
          fromClause += ` JOIN ${table} ON /* TODO: Specify join condition */`;
        }
      }
    }

    const query = `SELECT ${columnList} FROM ${fromClause} LIMIT 100`;
    setSqlQuery(query);
  };

  const fetchReportData = async (columns: DraggedColumn[], joinRelationships: JoinRelationship[]) => {
    if (columns.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Execute query using the Snowflake client
      const result = await executeQuery(sqlQuery, connection);
      
      // Process query results
      if (result && result.rows) {
        setReportData(result.rows);
      } else {
        setReportData([]);
      }
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Failed to load data');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const reorderColumns = (dragIndex: number, hoverIndex: number) => {
    setDraggedColumns(prev => {
      const newColumns = [...prev];
      const draggedColumn = newColumns[dragIndex];
      newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      return newColumns;
    });
  };

  return (
    <div 
      className="h-full flex flex-col bg-white" 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-1 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-700 px-2">Report Builder</span>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <span className="text-xs text-gray-500 px-2">{draggedColumns.length} columns</span>
        </div>
        
        <div className="flex items-center space-x-1 pr-1">
          <button
            className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100 focus:outline-none"
            title="Refresh data"
            onClick={() => fetchReportData(draggedColumns, joins)}
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dragged columns display */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-200 bg-gray-50 flex-wrap">
        {draggedColumns.length > 0 ? (
          draggedColumns.map((col, index) => (
            <div 
              key={`${col.tableName}-${col.column.name}-${index}`}
              className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-blue-200 text-xs"
              draggable
            >
              <span className="text-gray-600">{col.tableName}.{col.column.name}</span>
              <button 
                onClick={() => removeColumn(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 px-2 italic">Drag columns from the sidebar to build your report</div>
        )}
      </div>

      {/* SQL Query */}
      {sqlQuery && (
        <div className="flex items-center p-1 border-b border-gray-200 bg-white">
          <div className="flex-1 flex items-center">
            <div className="bg-gray-100 border border-gray-300 px-2 py-0.5 text-xs rounded-sm text-gray-700 font-mono overflow-x-auto whitespace-nowrap max-w-full">
              {sqlQuery}
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-2 m-2">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report data */}
      <div className={`flex-1 overflow-auto ${isDraggingOver ? 'bg-blue-50' : ''}`}>
        {draggedColumns.length > 0 ? (
          loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600">Loading data...</span>
            </div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {draggedColumns.map((col, index) => (
                    <th
                      key={`header-${col.tableName}-${col.column.name}-${index}`}
                      className="px-2 py-1.5 text-left text-xs font-medium text-gray-800 border-b border-r border-gray-300 select-none bg-gray-50 whitespace-nowrap"
                      style={{ height: '28px' }}
                    >
                      <div className="flex items-center">
                        <span className="truncate">{col.tableName}.{col.column.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((row, rowIndex) => (
                    <tr
                      key={`row-${rowIndex}`}
                      className={`hover:bg-blue-50 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      {draggedColumns.map((col, colIndex) => {
                        const colKey = `${col.tableName}.${col.column.name}`;
                        return (
                          <td
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="px-2 py-1 text-xs border-b border-r border-gray-200 truncate"
                            style={{ height: '24px' }}
                          >
                            {row[colKey] !== undefined ? String(row[colKey]) : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={draggedColumns.length} 
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md p-8">
              <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-md p-8 flex flex-col items-center justify-center">
                <TableCellsIcon className="h-10 w-10 text-blue-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Start building your report</p>
                <p className="text-xs text-gray-500">Drag columns from the sidebar to create custom reports</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Join prompt dialog */}
      {showJoinPrompt && pendingColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg max-w-md w-full p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Define Relationship</h3>
            <p className="text-xs text-gray-600 mb-4">
              How should <span className="font-medium">{pendingColumn.tableName}.{pendingColumn.column.name}</span> relate to your existing columns?
            </p>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Join with table
              </label>
              <select 
                className="w-full text-xs border border-gray-300 rounded-md p-1.5 text-gray-900"
                defaultValue={tablesInReport[0]}
              >
                {tablesInReport.map(table => (
                  <option key={table} value={table}>{table}</option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-2 justify-end">
              <button 
                onClick={cancelJoin}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmJoin(tablesInReport[0], 'CUSTOMER_ID', pendingColumn.column.name)}
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Status bar */}
      <div className="p-1 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        <span>{loading ? 'Executing query...' : 'Ready'}</span>
        <span>{reportData.length} rows</span>
      </div>
    </div>
  )
} 