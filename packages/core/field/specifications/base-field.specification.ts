import { CompositeSpecification } from '@egodb/domain'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { Field } from '../field.type.js'

export abstract class BaseFieldSpecification<F extends Field> extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: F) {
    super()
  }
}
