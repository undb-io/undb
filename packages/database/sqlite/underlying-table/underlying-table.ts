import type { ReferenceField } from '@egodb/core'
import type { IUnderlyingTable } from '../interfaces/underlying-table'

export class UnderlyingM2MTable implements IUnderlyingTable {
  constructor(private readonly tableName: string, private readonly field: ReferenceField) {}

  get name(): string {
    return `${this.field.id.value}_${this.tableName}`
  }
}
