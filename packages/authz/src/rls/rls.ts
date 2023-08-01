import type { TableId, ViewId } from '@undb/core'
import { RLSID } from './value-objects/rls-id.vo.js'
import { RLSPolicy } from './value-objects/rls-policy.vo.js'

/**
 * Record Level Security
 */
export class RLS {
  id!: RLSID
  tableId!: TableId
  viewId!: ViewId
  policy!: RLSPolicy

  static empty() {
    return new this()
  }
}
