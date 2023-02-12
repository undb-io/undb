import { CompositeSpecification } from '@egodb/domain'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { View } from '../view.js'

export abstract class BaseViewSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View) {
    super()
  }
}
