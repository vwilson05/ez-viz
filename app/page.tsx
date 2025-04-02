'use client'

import { useState } from 'react'
import Dashboard from './components/Dashboard'
import ConnectionForm from './components/ConnectionForm'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [connection, setConnection] = useState({
    account: '',
    username: '',
    password: '',
    warehouse: '',
    database: '',
    schema: 'PUBLIC',
    role: ''
  })

  const handleConnect = (connectionDetails: any) => {
    setConnection(connectionDetails)
    setIsConnected(true)
  }

  return (
    <main className="h-screen w-full flex flex-col bg-gray-50">
      <div className="w-full h-full flex-1">
        {!isConnected ? (
          <ConnectionForm onConnect={handleConnect} />
        ) : (
          <Dashboard 
            account={connection.account}
            username={connection.username}
            password={connection.password}
            warehouse={connection.warehouse}
            database={connection.database}
            schema={connection.schema}
            role={connection.role}
          />
        )}
      </div>
    </main>
  )
} 