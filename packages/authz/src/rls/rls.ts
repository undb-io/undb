import type { TableId, ViewId } from '@undb/core'
import { Option } from 'oxide.ts'
import { RLSID } from './value-objects/rls-id.vo.js'
import { RLSPolicy } from './value-objects/rls-policy.vo.js'

/**
 * Record Level Security
 */
export class RLS {
  id!: RLSID
  tableId!: TableId
  viewId!: Option<ViewId>
  policy!: RLSPolicy

  static empty() {
    return new this()
  }
}
