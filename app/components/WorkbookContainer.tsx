'use client'

import { useState, ReactNode } from 'react';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface ContainerProps {
  title?: string;
  children: ReactNode;
  collapsible?: boolean;
  bordered?: boolean;
  initialCollapsed?: boolean;
  fullWidth?: boolean;
  className?: string;
  onRemove?: () => void;
}

export const Container = ({
  title,
  children,
  collapsible = false,
  bordered = true,
  initialCollapsed = false,
  fullWidth = false,
  className = '',
  onRemove
}: ContainerProps) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [maximized, setMaximized] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  return (
    <div 
      className={`flex flex-col ${bordered ? 'border border-gray-200 rounded-md' : ''} ${
        maximized ? 'fixed inset-4 z-50 bg-white shadow-2xl' : fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="flex items-center space-x-1">
            {collapsible && (
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                {collapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
            )}
            <button 
              onClick={() => setMaximized(!maximized)}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            >
              {maximized ? (
                <ArrowsPointingInIcon className="h-4 w-4" />
              ) : (
                <ArrowsPointingOutIcon className="h-4 w-4" />
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowContextMenu(!showContextMenu)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </button>
              
              {showContextMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <div className="py-1">
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowContextMenu(false);
                        // Future functionality: clone container
                      }}
                    >
                      Duplicate
                    </button>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowContextMenu(false);
                        // Future functionality: export data
                      }}
                    >
                      Export data
                    </button>
                    {onRemove && (
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          setShowContextMenu(false);
                          onRemove();
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {onRemove && (
              <button 
                onClick={onRemove}
                className="p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className={`${collapsed ? 'hidden' : 'flex-1'} overflow-auto`}>
        {children}
      </div>
    </div>
  );
};

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'small' | 'medium' | 'large';
  className?: string;
}

export const Grid = ({ 
  children, 
  columns = 2, 
  gap = 'medium',
  className = '' 
}: GridProps) => {
  const gapClass = {
    none: 'gap-0',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6'
  }[gap];
  
  const columnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${columnsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

interface TabbedContainerProps {
  tabs: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
  className?: string;
}

export const TabbedContainer = ({ tabs, className = '' }: TabbedContainerProps) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);

  return (
    <div className={`flex flex-col border border-gray-200 rounded-md ${className}`}>
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTabId === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export const Modal = ({ 
  title, 
  isOpen, 
  onClose, 
  children,
  size = 'medium'
}: ModalProps) => {
  if (!isOpen) return null;
  
  const sizeClass = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }[size];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClass} flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main workbook layout component
interface WorkbookLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function WorkbookLayout({ children, className = '' }: WorkbookLayoutProps) {
  return (
    <div className={`p-4 bg-gray-100 min-h-full ${className}`}>
      {children}
    </div>
  );
} 