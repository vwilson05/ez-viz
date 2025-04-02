'use client'

import { useState } from 'react';
import WorkbookChart from './WorkbookChart';
import { Container, Grid, TabbedContainer, Modal } from './WorkbookContainer';
import { Control, FilterBar, ControlGroup, ControlDefinition } from './WorkbookControls';
import { mockCustomersData, mockOrdersData, mockProductsData } from '../lib/mock-data';

export default function WorkbookDemo() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('orders');
  
  // Sample chart data
  const salesData = [
    { label: 'Jan', value: 12500 },
    { label: 'Feb', value: 18200 },
    { label: 'Mar', value: 16800 },
    { label: 'Apr', value: 19500 },
    { label: 'May', value: 22300 },
    { label: 'Jun', value: 26500 },
  ];
  
  const productData = [
    { label: 'Shoes', value: 33400 },
    { label: 'Shirts', value: 26700 },
    { label: 'Pants', value: 19200 },
    { label: 'Hats', value: 8500 },
    { label: 'Accessories', value: 12900 },
  ];
  
  const channelData = [
    { label: 'Web', value: 47 },
    { label: 'Mobile', value: 32 },
    { label: 'In-store', value: 14 },
    { label: 'Partnerships', value: 7 },
  ];
  
  // Sample filters
  const filters: ControlDefinition[] = [
    {
      id: 'date_range',
      type: 'daterange',
      label: 'Date Range',
      defaultValue: [new Date('2023-01-01').toISOString(), new Date('2023-06-30').toISOString()]
    },
    {
      id: 'region',
      type: 'select',
      label: 'Region',
      options: [
        { label: 'All Regions', value: 'all' },
        { label: 'North America', value: 'na' },
        { label: 'Europe', value: 'eu' },
        { label: 'Asia Pacific', value: 'apac' },
      ],
      defaultValue: 'all'
    },
    {
      id: 'product_category',
      type: 'multiselect',
      label: 'Product Category',
      options: [
        { label: 'Shoes', value: 'shoes' },
        { label: 'Shirts', value: 'shirts' },
        { label: 'Pants', value: 'pants' },
        { label: 'Hats', value: 'hats' },
        { label: 'Accessories', value: 'accessories' },
      ],
      defaultValue: []
    }
  ];
  
  // Sample segmented control
  const metricControl: ControlDefinition = {
    id: 'metric',
    type: 'segmented',
    label: 'Metric',
    options: [
      { label: 'Orders', value: 'orders' },
      { label: 'Revenue', value: 'revenue' },
      { label: 'Customers', value: 'customers' },
    ],
    defaultValue: 'orders',
    onChange: (value) => setSelectedMetric(value as string)
  };

  // Generate KPI stats based on selected metric
  const getKpiValue = () => {
    switch (selectedMetric) {
      case 'orders':
        return '1,284';
      case 'revenue':
        return '$126,500';
      case 'customers':
        return '842';
      default:
        return '0';
    }
  };

  const getKpiChange = () => {
    switch (selectedMetric) {
      case 'orders':
        return '+12.4%';
      case 'revenue':
        return '+18.2%';
      case 'customers':
        return '+8.7%';
      default:
        return '0%';
    }
  };

  // Get mock data for the table display
  const getTableData = () => {
    switch (selectedMetric) {
      case 'orders':
        return mockOrdersData.rows.slice(0, 5);
      case 'revenue':
        return mockProductsData.rows.slice(0, 5).map(product => ({
          ...product as Record<string, any>,
          REVENUE: `$${((product.PRICE as number) * (Math.random() * 10 + 5)).toFixed(2)}`
        }));
      case 'customers':
        return mockCustomersData.rows.slice(0, 5);
      default:
        return [];
    }
  };

  // Get table columns
  const getTableColumns = () => {
    switch (selectedMetric) {
      case 'orders':
        return ['ORDER_ID', 'CUSTOMER_ID', 'ORDER_DATE', 'STATUS', 'TOTAL_AMOUNT'];
      case 'revenue':
        return ['PRODUCT_ID', 'NAME', 'CATEGORY', 'PRICE', 'REVENUE'];
      case 'customers':
        return ['CUSTOMER_ID', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'CITY'];
      default:
        return [];
    }
  };

  // Format cell value for display
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">E-Commerce Performance Analysis</h1>
        <p className="text-sm text-gray-600 mt-1">
          Interactive workbook demonstrating sales performance across channels and products
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar filters={filters} className="max-w-4xl" />
      </div>

      {/* Main content tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex">
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'products' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'customers' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Section */}
          <div className="mb-6">
            <Container title="KPI Dashboard">
              <div className="p-4">
                <div className="mb-4">
                  <Control definition={metricControl} />
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex-1 min-w-[200px]">
                    <div className="text-sm text-gray-500 mb-1">Total {selectedMetric}</div>
                    <div className="text-2xl font-bold text-gray-800">{getKpiValue()}</div>
                    <div className="mt-1 text-xs text-green-600">{getKpiChange()} vs. previous period</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex-1 min-w-[200px]">
                    <div className="text-sm text-gray-500 mb-1">Avg. per day</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {selectedMetric === 'revenue' ? '$4,216' : selectedMetric === 'customers' ? '28' : '43'}
                    </div>
                    <div className="mt-1 text-xs text-green-600">+5.2% vs. previous period</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex-1 min-w-[200px]">
                    <div className="text-sm text-gray-500 mb-1">Conversion rate</div>
                    <div className="text-2xl font-bold text-gray-800">3.8%</div>
                    <div className="mt-1 text-xs text-red-600">-0.4% vs. previous period</div>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Charts Section */}
          <div className="mb-6">
            <Grid columns={2} gap="medium">
              <Container title="Monthly Sales Trend">
                <WorkbookChart 
                  type="line" 
                  data={salesData}
                  xAxisLabel="Month (2023)"
                  height={300}
                />
              </Container>
              
              <Container title="Sales by Channel">
                <WorkbookChart 
                  type="donut" 
                  data={channelData}
                  height={300}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
                />
              </Container>
            </Grid>
          </div>

          {/* Table Section */}
          <div className="mb-6">
            <Container title={`Recent ${selectedMetric}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {getTableColumns().map(column => (
                        <th 
                          key={column}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getTableData().map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {getTableColumns().map(column => (
                          <td 
                            key={column}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {formatCellValue((row as Record<string, any>)[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">Showing 5 of 1,284 records</div>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setShowModal(true)}
                >
                  View all
                </button>
              </div>
            </Container>
          </div>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div>
          <Grid columns={2} gap="medium">
            <Container title="Product Sales">
              <WorkbookChart 
                type="bar" 
                data={productData}
                xAxisLabel="Product Category"
                height={300}
                colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']}
              />
            </Container>
            
            <Container title="Product Analysis">
              <TabbedContainer 
                tabs={[
                  {
                    id: 'performance',
                    label: 'Performance',
                    content: (
                      <div className="p-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Top Performing Products</h3>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 pl-2">
                            <li>Running Shoes - $12,540 (14.8% margin)</li>
                            <li>T-Shirts Premium - $8,720 (22.5% margin)</li>
                            <li>Denim Jeans - $7,450 (18.2% margin)</li>
                            <li>Baseball Caps - $4,280 (26.4% margin)</li>
                            <li>Leather Wallets - $3,960 (31.5% margin)</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Underperforming Products</h3>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 pl-2">
                            <li>Winter Jackets - $2,340 (8.4% margin)</li>
                            <li>Designer Socks - $1,840 (12.1% margin)</li>
                            <li>Sunglasses - $1,550 (15.8% margin)</li>
                          </ol>
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'inventory',
                    label: 'Inventory',
                    content: (
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <div className="text-sm font-medium text-green-800">Healthy Stock</div>
                            <div className="text-2xl font-bold text-green-700 mt-1">68%</div>
                            <div className="text-xs text-green-600 mt-1">124 products</div>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <div className="text-sm font-medium text-yellow-800">Low Stock</div>
                            <div className="text-2xl font-bold text-yellow-700 mt-1">22%</div>
                            <div className="text-xs text-yellow-600 mt-1">42 products</div>
                          </div>
                          
                          <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="text-sm font-medium text-red-800">Out of Stock</div>
                            <div className="text-2xl font-bold text-red-700 mt-1">10%</div>
                            <div className="text-xs text-red-600 mt-1">18 products</div>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <div className="text-sm font-medium text-blue-800">On Order</div>
                            <div className="text-2xl font-bold text-blue-700 mt-1">15%</div>
                            <div className="text-xs text-blue-600 mt-1">28 products</div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </Container>
          </Grid>
        </div>
      )}

      {/* Customers Tab Content */}
      {activeTab === 'customers' && (
        <div>
          <Grid columns={1} gap="medium">
            <Container title="Customer Insights">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Total Customers</div>
                    <div className="text-2xl font-bold text-gray-800">8,429</div>
                    <div className="mt-1 text-xs text-green-600">+12.4% vs. previous period</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Avg. Order Value</div>
                    <div className="text-2xl font-bold text-gray-800">$98.54</div>
                    <div className="mt-1 text-xs text-green-600">+3.8% vs. previous period</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Customer Retention</div>
                    <div className="text-2xl font-bold text-gray-800">76.2%</div>
                    <div className="mt-1 text-xs text-red-600">-1.3% vs. previous period</div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Demographics</h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-xs text-gray-500">Age Group</div>
                        <div className="text-xs text-gray-500">% of Customers</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="text-xs text-gray-700 w-20">18-24</div>
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '17%' }}></div>
                          </div>
                          <div className="text-xs text-gray-700 ml-2 w-8">17%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs text-gray-700 w-20">25-34</div>
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '38%' }}></div>
                          </div>
                          <div className="text-xs text-gray-700 ml-2 w-8">38%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs text-gray-700 w-20">35-44</div>
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '24%' }}></div>
                          </div>
                          <div className="text-xs text-gray-700 ml-2 w-8">24%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs text-gray-700 w-20">45-54</div>
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '14%' }}></div>
                          </div>
                          <div className="text-xs text-gray-700 ml-2 w-8">14%</div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-xs text-gray-700 w-20">55+</div>
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '7%' }}></div>
                          </div>
                          <div className="text-xs text-gray-700 ml-2 w-8">7%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Top Customer Locations</h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-700">New York, USA</div>
                          <div className="text-sm font-medium text-gray-700">842 (10%)</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-700">Los Angeles, USA</div>
                          <div className="text-sm font-medium text-gray-700">712 (8.4%)</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-700">London, UK</div>
                          <div className="text-sm font-medium text-gray-700">624 (7.4%)</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-700">Toronto, Canada</div>
                          <div className="text-sm font-medium text-gray-700">512 (6.1%)</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-700">Sydney, Australia</div>
                          <div className="text-sm font-medium text-gray-700">486 (5.8%)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </Grid>
        </div>
      )}

      {/* Modal */}
      <Modal
        title={`All ${selectedMetric}`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="large"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getTableColumns().map(column => (
                  <th 
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 15 }).map((_, index) => {
                const rowData = getTableData()[index % 5];
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    {getTableColumns().map(column => (
                      <td 
                        key={column}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {formatCellValue((rowData as Record<string, any>)[column])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-gray-500">Showing 15 of 1,284 records</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Next</button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 