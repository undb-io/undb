import type { TableId, ViewId } from '@undb/core'
import type { RLSPolicies } from './value-objects/rls-policies.vo.js'

export class RLS {
  tableId!: TableId
  viewId!: ViewId
  policies!: RLSPolicies

  static empty() {
    return new this()
  }
}
