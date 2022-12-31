import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldId } from '../../field'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'

export class WithKanbanField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View, public readonly fieldId: FieldId) {
    super()
  }

  isSatisfiedBy(): boolean {
    return this.view.kanbanSelectFieldId.mapOr(false, (fieldId) => fieldId.equals(this.fieldId))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateKanban().fieldId = this.fieldId
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.kanbanFieldEqual(this)
    return Ok(undefined)
  }
}
