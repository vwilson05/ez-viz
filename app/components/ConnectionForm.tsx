'use client'

import { useState } from 'react'
import { connectToSnowflake } from '../lib/snowflake-client'

interface ConnectionFormProps {
  onConnect: (connection: any) => void
}

export default function ConnectionForm({ onConnect }: ConnectionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connection, setConnection] = useState({
    account: '',
    username: '',
    password: '',
    warehouse: '',
    database: '',
    schema: 'PUBLIC',
    role: ''
  })

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clean up the account format if needed
    let cleanedAccount = connection.account.trim();
    if (cleanedAccount.includes('.snowflakecomputing.com')) {
      cleanedAccount = cleanedAccount.replace('.snowflakecomputing.com', '');
    }
    
    // Update the connection with the cleaned account
    const updatedConnection = {
      ...connection,
      account: cleanedAccount
    };
    
    // Validate required fields
    if (!updatedConnection.account || !updatedConnection.username || !updatedConnection.password || 
        !updatedConnection.warehouse || !updatedConnection.database) {
      setError('All fields except schema are required')
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting to connect to Snowflake...')
      
      // Connect to Snowflake - with a timeout in case it hangs
      const connectionPromise = connectToSnowflake(updatedConnection)
      
      // Set a timeout in case the connection hangs
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timed out after 30 seconds')), 30000)
      })
      
      // Race the connection against the timeout
      await Promise.race([connectionPromise, timeoutPromise])
      
      console.log('Connection successful, calling onConnect')
      
      // Call onConnect with the connection info (including password for API calls)
      onConnect(updatedConnection)
    } catch (err: any) {
      console.error('Connection error:', err)
      setError(err.message || 'Failed to connect to Snowflake')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setConnection(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">EZViz</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleConnect}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="account">
              Account
            </label>
            <input
              type="text"
              id="account"
              name="account"
              placeholder="your-account"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              value={connection.account}
              onChange={handleChange}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your account identifier (e.g., "xy12345" or "xy12345-myorg"). Don't include the full domain.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                value={connection.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                value={connection.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="warehouse">
              Warehouse
            </label>
            <input
              type="text"
              id="warehouse"
              name="warehouse"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              value={connection.warehouse}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="database">
                Database
              </label>
              <input
                type="text"
                id="database"
                name="database"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                value={connection.database}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schema">
                Schema (optional)
              </label>
              <input
                type="text"
                id="schema"
                name="schema"
                placeholder="PUBLIC"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                value={connection.schema}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
              Role (optional)
            </label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="Your role name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              value={connection.role}
              onChange={handleChange}
            />
            <p className="mt-1 text-xs text-gray-500">
              Specify a role that has access to the database objects you want to query
            </p>
          </div>
          
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  )
} 