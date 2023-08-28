import { type TableId } from '@undb/core'
import type { Subjects } from '../common/index.js'
import type { FLSID } from './value-objects/fls-id.vo.js'
import type { FLSPolicy } from './value-objects/fls-policy.vo.js'

/**
 * Field Level Security
 */
export class FLS {
  id!: FLSID
  tableId!: TableId
  policy!: FLSPolicy
  subjects!: Subjects

  static empty() {
    return new this()
  }
}
