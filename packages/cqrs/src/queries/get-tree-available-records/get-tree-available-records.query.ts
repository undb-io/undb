import { Query } from '@undb/domain'
import type { IGetTreeAvailableRecordsQuery } from './get-tree-available-records.query.interface.js'

export class GetTreeAvailableRecordsQuery extends Query implements IGetTreeAvailableRecordsQuery {
  readonly tableId: string
  readonly treeFieldId: string
  readonly recordId?: string
  readonly viewId?: string
  readonly q?: string

  constructor(query: IGetTreeAvailableRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.treeFieldId = query.treeFieldId
    this.recordId = query.recordId
    this.viewId = query.viewId
    this.q = query.q
  }
}
