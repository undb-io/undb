import { type TableId } from '@undb/core'
import type { FLSID } from './value-objects/fls-id.vo.js'

/**
 * Field Level Security
 */
export class FLS {
  id!: FLSID
  tableId!: TableId

  static empty() {
    return new this()
  }
}
