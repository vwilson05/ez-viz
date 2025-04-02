'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  account: string
  username: string
  warehouse: string
  database: string
  isDarkMode?: boolean
  toggleDarkMode?: () => void
}

export default function Header({ 
  account, 
  username, 
  warehouse, 
  database,
  isDarkMode = false,
  toggleDarkMode
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-blue-600">EZViz</h1>
        
        <div className="flex space-x-2 ml-6">
          <button className="text-sm text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            File
          </button>
          <button className="text-sm text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            Edit
          </button>
          <button className="text-sm text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            Data
          </button>
          <button className="text-sm text-gray-700 px-2 py-1 hover:bg-gray-100 rounded">
            Visualize
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {toggleDarkMode && (
          <button 
            onClick={toggleDarkMode}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        )}
        
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md border border-gray-200">
            <span className="mr-1">{username}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-900 font-semibold">{username}</p>
                <p className="text-xs text-gray-500 mt-1">{account}</p>
                <p className="text-xs text-gray-500 mt-1">DB: {database}</p>
                <p className="text-xs text-gray-500 mt-1">WH: {warehouse}</p>
              </div>
              
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } flex w-full items-center px-4 py-2 text-sm`}
                      onClick={() => window.location.reload()}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  )
} 