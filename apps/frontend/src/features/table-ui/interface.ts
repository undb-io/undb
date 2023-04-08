import type { Column, Header, HeaderGroup, Row } from '@tanstack/react-table'
import type { RecordAllValues, Records } from '@undb/core'

export type TData = RecordAllValues

export type THeaderGroup = HeaderGroup<TData>
export type THeader = Header<TData, unknown>
export type TColumn = Column<TData, unknown>

export type TRow = Row<TData>

export interface IProps {
  records: Records
}
