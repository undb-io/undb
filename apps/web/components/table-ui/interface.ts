import type { IFieldValue, QueryRecords, Table } from '@egodb/core'
import type { Header, HeaderGroup, Row } from '@tanstack/react-table'

// TODO: helper types should infered by type
export type TData = Record<string, IFieldValue>

export type THeaderGroup = HeaderGroup<TData>
export type THeader = Header<TData, unknown>

export type TRow = Row<TData>

export interface IProps {
  table: Table | null
  records: QueryRecords
}
