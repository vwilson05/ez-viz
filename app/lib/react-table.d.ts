import 'react-table'

declare module 'react-table' {
  export interface TableOptions<D extends object> extends UseTableOptions<D> {}

  export interface TableInstance<D extends object = {}>
    extends UseTableInstanceProps<D>,
      UseRowSelectInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseTableState<D>,
      UseRowSelectState<D> {}

  export interface Column<D extends object = {}>
    extends UseTableColumnOptions<D>,
      UseRowSelectColumnOptions<D> {}

  export interface ColumnInstance<D extends object = {}>
    extends UseTableColumnProps<D>,
      UseRowSelectColumnProps<D> {}

  export interface Cell<D extends object = {}, V = any>
    extends UseTableCellProps<D, V> {}

  export interface Row<D extends object = {}>
    extends UseTableRowProps<D>,
      UseRowSelectRowProps<D> {}
} 