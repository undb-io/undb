import type { RecordAllValues, Records } from '@egodb/core'
import type { Column, Header, HeaderGroup, Row } from '@tanstack/react-table'

export type TData = RecordAllValues

export type THeaderGroup = HeaderGroup<TData>
export type THeader = Header<TData, unknown>
export type TColumn = Column<TData, unknown>

export type TRow = Row<TData>

export interface IProps {
  records: Records
}
