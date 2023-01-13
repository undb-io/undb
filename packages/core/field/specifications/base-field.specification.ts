import { CompositeSpecification } from '@egodb/domain'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { Field } from '../field.type'

export abstract class BaseFieldSpecification<F extends Field> extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: F) {
    super()
  }
}
