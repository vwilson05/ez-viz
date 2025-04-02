'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginFormProps {
  onLogin: (credentials: SnowflakeCredentials) => void
}

interface SnowflakeCredentials {
  account: string
  username: string
  password: string
  warehouse: string
  database: string
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SnowflakeCredentials>()

  const onSubmit = async (data: SnowflakeCredentials) => {
    setIsLoading(true)
    try {
      // In a real app, we would verify the connection here
      // For now, we'll just simulate a successful connection
      setTimeout(() => {
        onLogin(data)
        setIsLoading(false)
      }, 800)
    } catch (error) {
      console.error('Failed to connect:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        Connect to Snowflake
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Identifier
          </label>
          <input
            id="account"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="your-account.snowflakecomputing.com"
            {...register('account', { required: 'Account is required' })}
          />
          {errors.account && <p className="mt-1 text-sm text-red-600">{errors.account.message}</p>}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="warehouse" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Warehouse
          </label>
          <input
            id="warehouse"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            {...register('warehouse', { required: 'Warehouse is required' })}
          />
          {errors.warehouse && <p className="mt-1 text-sm text-red-600">{errors.warehouse.message}</p>}
        </div>

        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Database
          </label>
          <input
            id="database"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            {...register('database', { required: 'Database is required' })}
          />
          {errors.database && <p className="mt-1 text-sm text-red-600">{errors.database.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </form>
    </div>
  )
} 