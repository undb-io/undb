import type { IQueryRecordSchema, QueryRecords, Table } from '@egodb/core'
import type { Header, HeaderGroup, Row } from '@tanstack/react-table'

export type TData = IQueryRecordSchema['values']

export type THeaderGroup = HeaderGroup<TData>
export type THeader = Header<TData, unknown>

export type TRow = Row<TData>

export interface IProps {
  table: Table
  records: QueryRecords
}
