'use client'

import { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

// Type definitions for control values
export type ControlValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | string[] 
  | number[] 
  | (string | number)[] // mixed array for multiselect
  | [string | null, string | null] // for date ranges
  | null;

export interface ControlOption {
  label: string;
  value: string | number;
}

export interface ControlDefinition {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'boolean' | 'number' | 'segmented';
  label: string;
  placeholder?: string;
  options?: ControlOption[];
  defaultValue?: ControlValue;
  onChange?: (value: ControlValue) => void;
}

interface ControlProps {
  definition: ControlDefinition;
  value: ControlValue;
  onChange: (value: ControlValue) => void;
  className?: string;
}

// Text Input Control
function TextControl({ definition, value, onChange, className = '' }: ControlProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <input
        type="text"
        value={value as string || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={definition.placeholder}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// Number Input Control
function NumberControl({ definition, value, onChange, className = '' }: ControlProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <input
        type="number"
        value={value as number || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder={definition.placeholder}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// Select Control
function SelectControl({ definition, value, onChange, className = '' }: ControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = definition.options || [];
  
  const handleSelect = (option: ControlOption) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Format the value for display in React node context
  const displayValue = () => {
    if (value === null || value === undefined) {
      return definition.placeholder || 'Select...';
    }
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || String(value);
  };

  return (
    <div className={`flex flex-col relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
      >
        <span className="truncate">
          {displayValue()}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1 text-sm">
          {options.map((option) => (
            <div
              key={option.value.toString()}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={(e) => { e.stopPropagation(); handleSelect(option); }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Multi-select Control
function MultiSelectControl({ definition, value, onChange, className = '' }: ControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const options = definition.options || [];
  const selectedValues = Array.isArray(value) ? value as (string | number)[] : [];
  
  const handleSelect = (optionValue: string | number) => {
    if (selectedValues.includes(optionValue)) {
      const newValues = selectedValues.filter((v) => v !== optionValue);
      onChange(newValues as ControlValue);
    } else {
      onChange([...selectedValues, optionValue] as ControlValue);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <div className={`flex flex-col relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
      >
        <span className="truncate">
          {selectedValues.length > 0
            ? selectedLabels
            : definition.placeholder || 'Select options...'}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 py-1 text-sm max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value.toString()}
              className={`px-3 py-2 flex items-center cursor-pointer hover:bg-blue-50 ${
                selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
              onClick={(e) => { e.stopPropagation(); handleSelect(option.value); }}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => {}}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2 focus:ring-blue-500"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
      
      {/* Selected items display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {options
            .filter(opt => selectedValues.includes(opt.value))
            .map(option => (
              <div key={option.value.toString()} className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1 text-xs flex items-center">
                {option.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  className="ml-1 text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Date Control
function DateControl({ definition, value, onChange, className = '' }: ControlProps) {
  const formattedValue = value instanceof Date 
    ? value.toISOString().split('T')[0] 
    : typeof value === 'string' ? value : '';
  
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <input
        type="date"
        value={formattedValue}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          onChange(date);
        }}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

// Date Range Control
function DateRangeControl({ definition, value, onChange, className = '' }: ControlProps) {
  // Safe handling of the date range array
  const dateArray = Array.isArray(value) ? value as [string | null, string | null] : [null, null];
  const startDate = dateArray[0];
  const endDate = dateArray[1];
  
  // Format date to ISO string for display in input
  const formatDateForInput = (dateValue: string | Date | null): string => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string') {
      try {
        return dateValue.split('T')[0]; // Handle ISO strings
      } catch (e) {
        return dateValue;
      }
    }
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    return '';
  };

  const formattedStartDate = formatDateForInput(startDate);
  const formattedEndDate = formatDateForInput(endDate);
  
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <div className="flex space-x-2">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">Start Date</div>
          <input
            type="date"
            value={formattedStartDate}
            onChange={(e) => {
              const dateStr = e.target.value ? new Date(e.target.value).toISOString() : null;
              onChange([dateStr, endDate]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">End Date</div>
          <input
            type="date"
            value={formattedEndDate}
            onChange={(e) => {
              const dateStr = e.target.value ? new Date(e.target.value).toISOString() : null;
              onChange([startDate, dateStr]);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

// Boolean Control
function BooleanControl({ definition, value, onChange, className = '' }: ControlProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="ml-2 block text-sm text-gray-700">{definition.label}</label>
    </div>
  );
}

// Segmented Control
function SegmentedControl({ definition, value, onChange, className = '' }: ControlProps) {
  const options = definition.options || [];
  
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{definition.label}</label>
      <div className="flex rounded-md border border-gray-300 overflow-hidden">
        {options.map((option) => (
          <button
            key={option.value.toString()}
            className={`flex-1 text-sm py-2 px-3 ${
              value === option.value 
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } ${options.indexOf(option) !== options.length - 1 ? 'border-r border-gray-300' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Main Control component that renders the appropriate control type
export function Control({ definition, className = '' }: { definition: ControlDefinition, className?: string }) {
  const [value, setValue] = useState<ControlValue>(definition.defaultValue || null);
  
  const handleChange = (newValue: ControlValue) => {
    setValue(newValue);
    if (definition.onChange) {
      definition.onChange(newValue);
    }
  };
  
  switch (definition.type) {
    case 'text':
      return <TextControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'number':
      return <NumberControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'select':
      return <SelectControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'multiselect':
      return <MultiSelectControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'date':
      return <DateControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'daterange':
      return <DateRangeControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'boolean':
      return <BooleanControl definition={definition} value={value} onChange={handleChange} className={className} />;
    case 'segmented':
      return <SegmentedControl definition={definition} value={value} onChange={handleChange} className={className} />;
    default:
      return null;
  }
}

// Filter Bar component for workbooks
interface FilterBarProps {
  filters: ControlDefinition[];
  onApplyFilters?: (filterValues: Record<string, ControlValue>) => void;
  className?: string;
}

export function FilterBar({ filters, onApplyFilters, className = '' }: FilterBarProps) {
  const [filterValues, setFilterValues] = useState<Record<string, ControlValue>>({});
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = (id: string, value: ControlValue) => {
    setFilterValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filterValues);
    }
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    setFilterValues({});
    if (onApplyFilters) {
      onApplyFilters({});
    }
  };
  
  const activeFilterCount = Object.values(filterValues).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined && value !== '';
  }).length;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
        <button
          className={`flex items-center text-sm ${
            activeFilterCount > 0 ? 'text-blue-600' : 'text-gray-700'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FunnelIcon className="h-4 w-4 mr-1" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1.5 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        
        {activeFilterCount > 0 && (
          <button
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {filters.map((filter) => (
              <Control
                key={filter.id}
                definition={{
                  ...filter,
                  onChange: (value) => handleFilterChange(filter.id, value)
                }}
                className="mb-3"
              />
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            <button
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Control Group for organizing multiple controls
interface ControlGroupProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ControlGroup({ title, children, className = '' }: ControlGroupProps) {
  return (
    <div className={`border border-gray-200 rounded-md ${className}`}>
      {title && (
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 text-sm font-medium text-gray-700">
          {title}
        </div>
      )}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
} 