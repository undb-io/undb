import type { Table } from '../table'
import type { Records } from './record.type'

export interface IRecordExportor {
  export(table: Table, viewId: string, data: Records): string | Buffer
}
