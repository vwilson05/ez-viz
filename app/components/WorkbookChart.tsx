'use client'

import { useState, useEffect, useRef } from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'donut' | 'area';
  data: ChartDataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  width?: string;
  colors?: string[];
  showLegend?: boolean;
  showValues?: boolean;
  className?: string;
}

export default function WorkbookChart({ 
  type = 'bar',
  data = [],
  title,
  xAxisLabel,
  yAxisLabel,
  height = 300,
  width = '100%',
  colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
  showLegend = true,
  showValues = false,
  className = ''
}: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [maxValue, setMaxValue] = useState(100);
  
  // Calculate the max value for scaling
  useEffect(() => {
    if (data.length > 0) {
      const max = Math.max(...data.map(d => d.value));
      setMaxValue(max > 0 ? max : 100);
    }
  }, [data]);
  
  // Get a color for a specific data point
  const getColor = (index: number) => {
    return data[index]?.color || colors[index % colors.length];
  };
  
  // Format values for display
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };
  
  // Calculate percentage for pie/donut charts
  const calculatePercentage = (value: number) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return total > 0 ? (value / total) * 100 : 0;
  };
  
  // Render a bar chart
  const renderBarChart = () => {
    return (
      <div className="pt-6 pb-2 px-4 h-full">
        <div className="flex h-full flex-col">
          {/* Y-axis and bars */}
          <div className="flex flex-1">
            {/* Y-axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 pb-6">
              <div>{formatValue(maxValue)}</div>
              <div>{formatValue(maxValue * 0.75)}</div>
              <div>{formatValue(maxValue * 0.5)}</div>
              <div>{formatValue(maxValue * 0.25)}</div>
              <div>0</div>
            </div>
            
            {/* Bars */}
            <div className="flex-1 flex items-end justify-around relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
              </div>
              
              {/* Actual bars */}
              {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative px-1 w-full flex justify-center">
                    <div 
                      className="w-14 max-w-full rounded-t transition-all duration-300 hover:opacity-80 relative cursor-pointer group"
                      style={{ 
                        height: `${(item.value / maxValue) * 100}%`,
                        backgroundColor: getColor(index)
                      }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-800 text-white px-2 py-1 text-xs rounded whitespace-nowrap">
                          {item.label}: {item.value}
                        </div>
                      </div>
                      
                      {/* Display value on bar */}
                      {showValues && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                          {formatValue(item.value)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 whitespace-nowrap max-w-[80px] truncate">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis label */}
          {xAxisLabel && (
            <div className="text-xs text-gray-500 text-center mt-4">
              {xAxisLabel}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render a line chart
  const renderLineChart = () => {
    // Calculate points for the line
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="pt-6 pb-2 px-4 h-full">
        <div className="flex h-full flex-col">
          {/* Y-axis and chart */}
          <div className="flex flex-1">
            {/* Y-axis */}
            <div className="flex flex-col justify-between text-xs text-gray-500 pr-2 pb-6">
              <div>{formatValue(maxValue)}</div>
              <div>{formatValue(maxValue * 0.75)}</div>
              <div>{formatValue(maxValue * 0.5)}</div>
              <div>{formatValue(maxValue * 0.25)}</div>
              <div>0</div>
            </div>
            
            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
                <div className="border-t border-gray-200 h-0 w-full"></div>
              </div>
              
              {/* Line */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={points}
                  fill="none"
                  stroke={colors[0]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Area under the line for area chart */}
                {type === 'area' && (
                  <polygon
                    points={`0,100 ${points} 100,100`}
                    fill={colors[0]}
                    fillOpacity="0.2"
                  />
                )}
                
                {/* Data points */}
                {data.map((item, index) => {
                  const x = (index / (data.length - 1 || 1)) * 100;
                  const y = 100 - (item.value / maxValue) * 100;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="white"
                      stroke={colors[0]}
                      strokeWidth="1.5"
                      className="hover:r-3 transition-all duration-200 cursor-pointer"
                    />
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 inset-x-0 flex justify-between">
                {data.map((item, index) => (
                  <div key={index} className="text-xs text-gray-600 truncate text-center" style={{ width: `${100 / data.length}%` }}>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* X-axis label */}
          {xAxisLabel && (
            <div className="text-xs text-gray-500 text-center mt-4">
              {xAxisLabel}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render a pie/donut chart
  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            {/* SVG for pie/donut */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {data.map((item, index) => {
                const percentage = calculatePercentage(item.value);
                const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
                cumulativePercentage += percentage;
                const endAngle = cumulativePercentage * 3.6;
                
                // Calculate the path for the arc
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                // Flag for large arc
                const largeArcFlag = percentage > 50 ? 1 : 0;
                
                // Create the path
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={getColor(index)}
                    className="hover:opacity-80 cursor-pointer"
                  />
                );
              })}
              
              {/* Center hole for donut chart */}
              {type === 'donut' && (
                <circle cx="50" cy="50" r="25" fill="white" />
              )}
            </svg>
            
            {/* Display total in center for donut chart */}
            {type === 'donut' && (
              <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-800">
                {formatValue(total)}
              </div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-1"
                  style={{ backgroundColor: getColor(index) }}
                ></div>
                <div className="text-xs text-gray-700 mr-1">{item.label}</div>
                <div className="text-xs text-gray-500">{`(${calculatePercentage(item.value).toFixed(1)}%)`}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
      case 'area':
        return renderLineChart();
      case 'pie':
      case 'donut':
        return renderPieChart();
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col ${className}`}
      style={{ height: height, width }}
      ref={chartRef}
    >
      {title && (
        <div className="border-b border-gray-200 px-4 py-2">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No data to display
          </div>
        )}
      </div>
    </div>
  );
} 