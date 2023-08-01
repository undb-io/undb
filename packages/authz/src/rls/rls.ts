import { TableId } from '@undb/core'
import { RLSDetails } from './value-objects/rls-details.vo.js'

export class RLS {
  tableId!: TableId
  details!: RLSDetails

  static empty() {
    return new this()
  }
}
