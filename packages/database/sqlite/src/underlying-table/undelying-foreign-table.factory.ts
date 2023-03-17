import type { ReferenceFieldTypes } from '@egodb/core'
import type { IUnderlyingForeignTable } from '../interfaces/underlying-foreign-table.js'
import { AdjacencyListTable, ClosureTable } from './underlying-foreign-table.js'

export class UnderlyingForeignTableFactory {
  static create(foreignTableId: string, field: ReferenceFieldTypes): IUnderlyingForeignTable {
    switch (field.type) {
      case 'parent':
      case 'tree':
        return new ClosureTable(foreignTableId, field)
      case 'reference':
        return new AdjacencyListTable(foreignTableId, field)
    }
  }
}
