import { CompositeSpecification } from '@egodb/domain'
import { Result } from 'oxide.ts/dist'
import { FieldId } from '../../field'
import { ITableSpecVisitor } from '../../specifications'
import { Table } from '../../table'
import { View } from '../view'

export class WithKanbanField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View, public readonly fieldId: FieldId) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
