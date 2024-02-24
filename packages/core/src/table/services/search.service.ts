import { Record } from '../record/record.js'
import { Table } from '../table.js'

export interface ISearchTableService {
  initSearchForTable(table: Table): Promise<void>

  onRecordCreated(table: Table, record: Record): Promise<void>
  onRecordUpdated(table: Table, record: Record): Promise<void>
  onRecordDeleted(table: Table, record: Record): Promise<void>
}
