import { Table } from '../table.js'

export interface ISearchService {
  initSearchForTable(table: Table): Promise<void>
}
