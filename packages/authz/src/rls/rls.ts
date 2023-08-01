import { TableId } from '@undb/core'
import { RLSDetail } from './value-objects'

export class RLS {
  tableId!: TableId
  details!: RLSDetail[]
}
