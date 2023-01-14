import { CompositeSpecification } from '@egodb/domain'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'

export abstract class BaseViewSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View) {
    super()
  }
}
