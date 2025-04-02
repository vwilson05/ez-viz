'use client'

import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
// Commented out the non-existent components until we implement them
// import SchemaExplorer from './SchemaExplorer'
// import Spreadsheet from './Spreadsheet'
import WorkbookDemo from './WorkbookDemo'
import { mockDatabaseSchema } from '../lib/mock-data'
// import { getSchema } from '../lib/snowflake-client'

// Simple TableView component to show data for a selected table
function TableView({ tableName, connection }: { tableName: string, connection: any }) {
  const [data, setData] = useState<any>({
    columns: [],
    rows: [],
    totalRows: 0,
    queryId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Import the executeQuery function dynamically
        const { executeQuery } = await import('../lib/snowflake-client');
        
        // Format the query with proper schema and table name
        const schema = connection.schema || 'PUBLIC';
        const query = `SELECT * FROM "${schema}"."${tableName}" LIMIT 100`;
        
        // Execute the query
        const result = await executeQuery(query, connection);
        setData(result);
      } catch (err: any) {
        console.error('Error fetching table data:', err);
        setError(err.message || 'Failed to load data');
        
        // Set empty data
        setData({
          columns: ['ERROR'],
          rows: [{ ERROR: 'Failed to load data. ' + (err.message || '') }],
          totalRows: 1,
          queryId: 'error-query'
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch data when component mounts or tableName changes
    fetchData();
  }, [tableName, connection]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-700">{tableName}</h2>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${data.totalRows} rows · Last updated just now`}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100">
            Create Chart
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 text-lg mb-1">Error loading data</p>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : data.rows.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {data.columns.map((column: string) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {data.columns.map((column: string) => (
                    <td 
                      key={`${rowIndex}-${column}`} 
                      className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100"
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
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg mb-1">No data available</p>
              <p className="text-gray-400 text-sm">This table may be empty or not accessible</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="py-2 px-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs">
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
    </div>
  );
}

// New workbook page interface
interface WorkbookPage {
  id: string;
  name: string;
  type: 'table' | 'chart' | 'dashboard' | 'custom';
  icon?: string;
  content?: React.ReactNode;
  tableName?: string;
}

interface DashboardProps {
  account: string;
  username: string;
  password: string;
  warehouse: string;
  database: string;
  schema: string;
  role: string;
}

export default function Dashboard({
  account,
  username,
  password,
  warehouse,
  database,
  schema: schemaName = 'PUBLIC',
  role
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState('data')
  const [schema, setSchema] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  
  // Set connection data from props
  const [selectedConnection, setSelectedConnection] = useState({
    account,
    username,
    password,
    database,
    warehouse,
    schema: schemaName,
    role
  })
  
  // New workbook state
  const [workbookPages, setWorkbookPages] = useState<WorkbookPage[]>([
    {
      id: 'page-1',
      name: 'Main Table',
      type: 'table',
      icon: 'table'
    },
    {
      id: 'page-2',
      name: 'Dashboard',
      type: 'dashboard',
      icon: 'chart-bar'
    }
  ]);
  const [activePageId, setActivePageId] = useState('page-1');
  const [isEditingPageName, setIsEditingPageName] = useState<string | null>(null);
  const editNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Remove dark mode classes if present
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
    // Reset background color
    document.body.style.backgroundColor = ''
    
    loadSchema()
  }, [])
  
  // Update connection state when props change
  useEffect(() => {
    setSelectedConnection({
      account,
      username,
      password,
      database,
      warehouse,
      schema: schemaName,
      role
    });
    
    // Reload schema when connection changes
    loadSchema();
  }, [account, username, password, database, warehouse, schemaName, role]);
  
  // Close edit name input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditingPageName && 
        editNameInputRef.current && 
        !editNameInputRef.current.contains(event.target as Node)
      ) {
        setIsEditingPageName(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingPageName]);

  const loadSchema = async () => {
    setIsLoading(true)
    try {
      // Check if we have connection details
      if (selectedConnection.account && selectedConnection.username) {
        try {
          // Import the function dynamically to avoid issues
          const { getSchema } = await import('../lib/snowflake-client');
          
          // Attempt to get the real schema from Snowflake
          const schemaData = await getSchema(selectedConnection);
          setSchema(schemaData);
          console.log('Successfully loaded schema from Snowflake');
        } catch (error) {
          console.error('Error loading schema from Snowflake:', error)
          // Fallback to mock data only for development
          console.log('Falling back to mock data');
          setSchema(mockDatabaseSchema);
        }
      } else {
        // Use mock data for development
        console.log('Loading mock data for development (no connection details)');
        setSchema(mockDatabaseSchema);
      }
    } catch (error) {
      console.error('Error loading schema:', error);
      setSchema(mockDatabaseSchema);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle selecting a table from the sidebar
  const handleSelectTable = (tableName: string) => {
    setSelectedTable(tableName);
    
    // Optional: automatically create a new page for this table
    // Comment this out if you want manual page creation only
    createTablePage(tableName);
    
    setActiveTab('data');
  }
  
  // Add a new page to the workbook
  const addNewPage = () => {
    const newPageId = `page-${workbookPages.length + 1}-${Date.now()}`;
    const newPage: WorkbookPage = {
      id: newPageId,
      name: `Page ${workbookPages.length + 1}`,
      type: 'table',
      icon: 'table'
    };
    
    setWorkbookPages(prev => [...prev, newPage]);
    setActivePageId(newPageId);
  };
  
  // Create a new page with selected table data
  const createTablePage = (tableName: string) => {
    const newPageId = `page-table-${Date.now()}`;
    const newPage: WorkbookPage = {
      id: newPageId,
      name: `${tableName} Table`,
      type: 'table',
      icon: 'table',
      tableName: tableName  // Store the table name to display in the page
    };
    
    setWorkbookPages(prev => [...prev, newPage]);
    setActivePageId(newPageId);
  };
  
  // Handle page deletion
  const deletePage = (pageId: string) => {
    if (workbookPages.length <= 1) {
      alert("Cannot delete the last page");
      return;
    }
    
    setWorkbookPages(prev => prev.filter(page => page.id !== pageId));
    
    if (activePageId === pageId) {
      setActivePageId(workbookPages[0].id);
    }
  };
  
  // Start editing page name
  const startEditingPageName = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingPageName(pageId);
    
    // Focus the input after a small delay to ensure it's in the DOM
    setTimeout(() => {
      if (editNameInputRef.current) {
        editNameInputRef.current.focus();
        editNameInputRef.current.select();
      }
    }, 10);
  };
  
  // Update page name
  const updatePageName = (pageId: string, newName: string) => {
    setWorkbookPages(prev => 
      prev.map(page => 
        page.id === pageId ? { ...page, name: newName || `Page ${page.id}` } : page
      )
    );
    setIsEditingPageName(null);
  };
  
  // Handle page name input key press
  const handlePageNameKeyPress = (e: React.KeyboardEvent, pageId: string) => {
    if (e.key === 'Enter') {
      updatePageName(pageId, (e.target as HTMLInputElement).value);
    } else if (e.key === 'Escape') {
      setIsEditingPageName(null);
    }
  };
  
  // Clone the current page
  const clonePage = (pageId: string) => {
    const pageToClone = workbookPages.find(page => page.id === pageId);
    if (!pageToClone) return;
    
    const newPageId = `page-${workbookPages.length + 1}-${Date.now()}`;
    const newPage: WorkbookPage = {
      ...pageToClone,
      id: newPageId,
      name: `${pageToClone.name} (Copy)`
    };
    
    setWorkbookPages(prev => [...prev, newPage]);
    setActivePageId(newPageId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white w-full">
      {/* Main content with single sidebar */}
      <div className="flex h-full">
        {/* Single sidebar on the left */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <Sidebar 
            schema={schema}
            activeTable={selectedTable}
            onSelectTable={handleSelectTable}
            connection={selectedConnection}
          />
        </div>
        
        {/* Main content area with header and content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Workbook Header */}
          <div className="border-b border-gray-200 bg-white shadow-sm w-full">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-800">E-Commerce Analytics Workbook</h1>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Draft</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Share
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Export
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New
                </button>
              </div>
            </div>
            
            {/* Workbook Tabs */}
            <div className="flex border-b border-gray-200 w-full">
              <div className="flex items-center overflow-x-auto py-1 px-2 flex-1">
                {workbookPages.map(page => (
                  <div 
                    key={page.id}
                    className={`flex items-center px-3 py-1.5 mr-1 rounded-t border-b-2 cursor-pointer text-sm whitespace-nowrap ${
                      activePageId === page.id 
                        ? 'border-blue-500 text-blue-600 font-medium'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => setActivePageId(page.id)}
                  >
                    {/* Page icon */}
                    {page.icon === 'table' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {page.icon === 'chart-bar' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    
                    {/* Page name (editable or display) */}
                    {isEditingPageName === page.id ? (
                      <input
                        ref={editNameInputRef}
                        type="text"
                        defaultValue={page.name}
                        className="border border-gray-300 rounded py-0.5 px-1 text-xs w-32"
                        onBlur={(e) => updatePageName(page.id, e.target.value)}
                        onKeyDown={(e) => handlePageNameKeyPress(e, page.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span onDoubleClick={(e) => startEditingPageName(page.id, e)}>{page.name}</span>
                    )}
                    
                    {/* Page actions */}
                    {activePageId === page.id && (
                      <div className="flex items-center ml-1.5">
                        <button 
                          className="text-gray-400 hover:text-gray-600 ml-1 p-0.5 rounded-full hover:bg-gray-100"
                          title="Clone page"
                          onClick={(e) => { e.stopPropagation(); clonePage(page.id); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600 ml-1 p-0.5 rounded-full hover:bg-gray-100"
                          title="Delete page"
                          onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add new page button */}
                <button 
                  className="flex items-center text-gray-600 hover:text-gray-800 px-3 py-1.5 text-sm"
                  onClick={addNewPage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="ml-1">New Page</span>
                </button>
              </div>
              
              {/* Additional workbook navigation */}
              <div className="flex items-center px-2 border-l border-gray-200">
                <button className="text-gray-600 hover:text-gray-800 p-1.5 rounded hover:bg-gray-50" title="Version history">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 p-1.5 rounded hover:bg-gray-50" title="Publish">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Workbook content area - tables/visualizations go here */}
          <div className="flex-1 w-full h-full overflow-auto">
            {(() => {
              const activePage = workbookPages.find(p => p.id === activePageId);
              
              if (activePage?.type === 'dashboard') {
                return <WorkbookDemo />;
              } else if (activePage?.type === 'table' && activePage.tableName) {
                return <TableView tableName={activePage.tableName} connection={selectedConnection} />;
              } else if (selectedTable) {
                return <TableView tableName={selectedTable} connection={selectedConnection} />;
              } else {
                return (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md px-6 py-8">
                      <div className="bg-blue-50 rounded-full p-4 mb-5 inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Welcome to your workbook</h3>
                      <p className="text-gray-600 mb-5">Select a table from the database explorer to begin your analysis or create a new visualization.</p>
                      <div className="flex gap-3 justify-center">
                        <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          New Table
                        </button>
                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                          Create Visualization
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
          
          {/* Collaboration footer */}
          <div className="border-t border-gray-200 bg-gray-50 py-2 px-4 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-600">
              <div className="flex items-center space-x-1 mr-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Live Edit enabled</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">Last saved:</span>
                <span>Just now</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-xs text-gray-600 hover:text-gray-800 mr-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Add comment
              </button>
              <div className="flex -space-x-1">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white">JD</div>
                <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs border-2 border-white">AB</div>
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white hover:bg-gray-300 cursor-pointer">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 