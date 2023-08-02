import type { TableId, ViewId } from '@undb/core'
import type { Option } from 'oxide.ts'
import type { RLSSpecification } from './interface.js'
import type { IUpdateRLSSchema } from './rls.schema.js'
import type { RLSID } from './value-objects/rls-id.vo.js'
import type { RLSPolicy } from './value-objects/rls-policy.vo.js'

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

  public update(input: IUpdateRLSSchema): Option<RLSSpecification> {
    throw new Error('Method not implemented.')
  }
}
