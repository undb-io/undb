import { ValueObject } from '@egodb/domain'
import type { Column } from '../column'

export class TableSchema extends ValueObject {
  constructor(public readonly column: Column<any>) {
    super({ column })
  }
}
