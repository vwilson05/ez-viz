'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon, ChevronRightIcon, ServerIcon, CubeIcon, TableCellsIcon, KeyIcon, HashtagIcon, CalendarIcon, DocumentTextIcon, MagnifyingGlassIcon, FolderIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { DatabaseSchema, Schema, Table, Column } from '../lib/types'
import { getTablesForSchema, getColumnsForTable } from '../lib/snowflake-client'

interface SidebarProps {
  schema: DatabaseSchema | null
  activeTable: string | null
  onSelectTable: (tableName: string) => void
  onSelectSchema?: (schemaName: string) => void
  currentSchema?: string
  connection: any
  isReportBuilder?: boolean
}

export default function Sidebar({ 
  schema, 
  activeTable, 
  onSelectTable,
  onSelectSchema,
  currentSchema = 'PUBLIC',
  connection,
  isReportBuilder = false
}: SidebarProps) {
  const [isDatabaseExpanded, setIsDatabaseExpanded] = useState(true)
  const [expandedSchemas, setExpandedSchemas] = useState<Record<string, boolean>>({})
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')
  const [openSchemas, setOpenSchemas] = useState<Record<string, boolean>>({})
  const [loadedSchemas, setLoadedSchemas] = useState<Record<string, any[]>>({})
  const [isLoadingTables, setIsLoadingTables] = useState<string | null>(null)
  const [tablesError, setTablesError] = useState<string | null>(null)
  const [tableColumns, setTableColumns] = useState<Record<string, any[]>>({})
  const [loadingColumns, setLoadingColumns] = useState<string | null>(null)
  const [columnsError, setColumnsError] = useState<Record<string, string>>({})

  useEffect(() => {
    if (schema && schema.schemas && schema.schemas.length > 0) {
      setExpandedSchemas({
        [schema.schemas[0].name]: true
      });
    }
  }, [schema]);

  const toggleDatabase = () => {
    setIsDatabaseExpanded(!isDatabaseExpanded)
  }

  const toggleSchema = async (schemaName: string) => {
    // Toggle the open state
    const isCurrentlyOpen = openSchemas[schemaName] || false
    setOpenSchemas(prev => ({
      ...prev,
      [schemaName]: !isCurrentlyOpen
    }))
    
    // If we're opening the schema and haven't loaded its tables yet, fetch them
    if (!isCurrentlyOpen && !loadedSchemas[schemaName]) {
      try {
        setIsLoadingTables(schemaName)
        setTablesError(null)
        
        // Fetch tables for this schema
        const tables = await getTablesForSchema(schemaName, connection)
        
        // Store the loaded tables
        setLoadedSchemas(prev => ({
          ...prev,
          [schemaName]: tables
        }))
      } catch (error: any) {
        console.error(`Error loading tables for schema ${schemaName}:`, error)
        setTablesError(`Failed to load tables: ${error.message}`)
      } finally {
        setIsLoadingTables(null)
      }
    }
  }

  const toggleTable = async (tableName: string, schemaName: string) => {
    const isCurrentlyOpen = expandedTables[tableName] || false
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !isCurrentlyOpen
    }))

    // If we're opening the table and haven't loaded its columns yet, fetch them
    const fullTableName = `${schemaName}.${tableName}`
    if (!isCurrentlyOpen && !tableColumns[fullTableName] && isReportBuilder) {
      try {
        setLoadingColumns(fullTableName)
        setColumnsError(prev => ({ ...prev, [fullTableName]: '' }))
        
        // Fetch columns for this table
        const columns = await getColumnsForTable(connection, schemaName, tableName)
        
        // Store the loaded columns
        setTableColumns(prev => ({
          ...prev,
          [fullTableName]: columns
        }))
      } catch (error: any) {
        console.error(`Error loading columns for table ${fullTableName}:`, error)
        setColumnsError(prev => ({ 
          ...prev, 
          [fullTableName]: `Failed to load columns: ${error.message}` 
        }))
      } finally {
        setLoadingColumns(null)
      }
    }
  }

  const getColumnIcon = (type: string, isPrimaryKey?: boolean, isForeignKey?: boolean) => {
    if (isPrimaryKey) {
      return <KeyIcon className="h-3 w-3 mr-1.5 text-yellow-500" />;
    }
    
    if (isForeignKey) {
      return <KeyIcon className="h-3 w-3 mr-1.5 text-blue-500" />;
    }
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes('int') || lowerType.includes('number') || lowerType.includes('float')) {
      return <HashtagIcon className="h-3 w-3 mr-1.5 text-purple-500" />;
    }
    
    if (lowerType.includes('date') || lowerType.includes('time')) {
      return <CalendarIcon className="h-3 w-3 mr-1.5 text-green-500" />;
    }
    
    return <DocumentTextIcon className="h-3 w-3 mr-1.5 text-gray-500" />;
  };

  const handleDragStart = (e: React.DragEvent, column: any, tableName: string) => {
    // Set the drag data with column and table information
    e.dataTransfer.setData('text/plain', JSON.stringify({
      column: column,
      table: tableName
    }));
    
    // Set a drag image/ghost element
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('bg-blue-100', 'text-blue-800', 'px-2', 'py-1', 'rounded', 'text-sm');
    ghostElement.textContent = `${column.name}`;
    document.body.appendChild(ghostElement);
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Remove the ghost element after the drag operation
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  // Filter tables by search term
  const getFilteredTables = (schemaName: string) => {
    if (!search) return loadedSchemas[schemaName] || []
    
    return (loadedSchemas[schemaName] || []).filter((table: any) => 
      table.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (!schema) {
    return (
      <div className="h-full bg-gray-50 p-4">
        <div className="text-gray-500 text-sm">No schema data available</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Database Explorer</h2>
        
        {/* Schema Selector */}
        {schema.schemas.length > 1 && onSelectSchema && (
          <div className="mb-3">
            <label htmlFor="schema-select" className="block text-xs text-gray-500 mb-1">
              Schema
            </label>
            <select 
              id="schema-select"
              value={currentSchema}
              onChange={(e) => onSelectSchema(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            >
              {schema.schemas.map((schemaObj) => (
                <option key={schemaObj.name} value={schemaObj.name}>
                  {schemaObj.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search tables..."
            className="w-full pl-8 pr-2 py-1 text-sm border border-gray-300 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
        </div>
        
        <button 
          onClick={() => {
            // Clear loaded schemas cache
            setLoadedSchemas({});
            setOpenSchemas({});
            // Force reload the current page
            window.location.reload();
          }}
          className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded flex items-center justify-center"
        >
          <ArrowPathIcon className="h-3 w-3 mr-1" /> Clear Cache
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {schema.schemas.map((schemaObj) => {
          const isOpen = openSchemas[schemaObj.name] || false
          const filteredTables = isOpen ? getFilteredTables(schemaObj.name) : []
          const isLoading = isLoadingTables === schemaObj.name
          
          // Skip schemas that don't match the search term if search is active
          if (search && !schemaObj.name.toLowerCase().includes(search.toLowerCase()) && 
              (!isOpen || filteredTables.length === 0)) {
            return null
          }
          
          return (
            <div key={schemaObj.name} className="mb-2">
              <div 
                className="flex items-center text-sm text-gray-700 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => toggleSchema(schemaObj.name)}
              >
                {isOpen ? (
                  <ChevronDownIcon className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ChevronRightIcon className="h-3.5 w-3.5 mr-1" />
                )}
                <FolderIcon className="h-4 w-4 mr-1.5 text-yellow-500" />
                <span className="font-medium">{schemaObj.name}</span>
                
                {isLoading && (
                  <div className="ml-2 h-3 w-3 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                )}
              </div>
              
              {isOpen && (
                <div className="pl-7 mt-1 space-y-1">
                  {tablesError && (
                    <div className="text-xs text-red-500 p-1">
                      {tablesError}
                    </div>
                  )}
                  
                  {filteredTables.length > 0 ? (
                    filteredTables.map((table: any) => (
                      <div key={table.name}>
                        <div 
                          className={`flex items-center text-sm py-1 px-2 rounded cursor-pointer ${
                            activeTable === `${schemaObj.name}.${table.name}`
                              ? 'bg-blue-100 text-blue-700' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => isReportBuilder ? toggleTable(table.name, schemaObj.name) : onSelectTable(`${schemaObj.name}.${table.name}`)}
                        >
                          {isReportBuilder ? (
                            expandedTables[table.name] ? (
                              <ChevronDownIcon className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <ChevronRightIcon className="h-3.5 w-3.5 mr-1" />
                            )
                          ) : null}
                          
                          <TableCellsIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                          <span>{table.name}</span>
                          
                          {loadingColumns === `${schemaObj.name}.${table.name}` && (
                            <div className="ml-2 h-3 w-3 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                          )}
                        </div>
                        
                        {/* Show columns if table is expanded */}
                        {isReportBuilder && expandedTables[table.name] && (
                          <div className="pl-6 pt-1 pb-1">
                            {columnsError[`${schemaObj.name}.${table.name}`] && (
                              <div className="text-xs text-red-500 p-1">
                                {columnsError[`${schemaObj.name}.${table.name}`]}
                              </div>
                            )}
                            
                            {tableColumns[`${schemaObj.name}.${table.name}`]?.length > 0 ? (
                              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                {tableColumns[`${schemaObj.name}.${table.name}`].map((column: any) => (
                                  <div 
                                    key={column.name}
                                    className="flex items-center text-xs py-1 px-2 rounded border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 cursor-grab"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, column, `${schemaObj.name}.${table.name}`)}
                                  >
                                    {getColumnIcon(column.type, column.isPrimaryKey, column.isForeignKey)}
                                    <span className="truncate text-gray-800">{column.name}</span>
                                    <span className="ml-1 text-gray-400 text-xs">{column.type.toLowerCase()}</span>
                                  </div>
                                ))}
                              </div>
                            ) : !loadingColumns && (
                              <div className="text-xs text-gray-500 p-1">
                                No columns found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    !isLoading && (
                      <div className="text-xs text-gray-500 p-1">
                        No tables found
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )
} 