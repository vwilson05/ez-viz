export interface Column {
  name: string
  type: string
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  isNullable?: boolean
  defaultValue?: string
  maxLength?: number
  references?: {
    table: string
    column: string
  }
}

export interface Table {
  name: string
  schema?: string
  columns: Column[]
}

export interface Schema {
  name: string
  tables: Table[]
}

export interface DatabaseSchema {
  name: string
  schemas: Schema[]
}

export interface SnowflakeCredentials {
  account: string
  username: string
  password: string
  warehouse: string
  database: string
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  totalRows: number
  queryId: string
}

export interface Metric {
  id: string
  name: string
  description: string
  sql: string
  createdAt: Date
}

export interface Filter {
  column: string
  operator: string
  value: any
  isCustom?: boolean
}

export interface Sort {
  column: string
  direction: 'asc' | 'desc'
}

export interface QueryOptions {
  columns: string[]
  filters: Filter[]
  sorts: Sort[]
  limit?: number
  offset?: number
  aggregations?: {
    column: string
    function: 'sum' | 'avg' | 'min' | 'max' | 'count'
    alias?: string
  }[]
  groupBy?: string[]
}

export interface ConnectionInfo {
  account: string
  username: string
  password?: string
  warehouse: string
  database: string
  schema?: string
  role?: string
}

export interface CustomColumn {
  name: string
  expression: string
  type: 'formula' | 'calculated' | 'aggregate'
}

export interface JoinRelationship {
  leftTable: string
  leftColumn: string
  rightTable: string
  rightColumn: string
  type: 'inner' | 'left' | 'right' | 'full'
}

export interface DataSource {
  type: 'table' | 'view' | 'query'
  name: string
  schema?: string
  database?: string
  query?: string
}

export interface Report {
  id: string
  name: string
  description?: string
  dataSources: DataSource[]
  columns: (Column | CustomColumn)[]
  filters: Filter[]
  sorts: Sort[]
  joins: JoinRelationship[]
  groupBy?: string[]
  limit?: number
  createdAt: string
  updatedAt: string
} 