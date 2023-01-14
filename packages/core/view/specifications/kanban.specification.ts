import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldKey } from '../../field'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'
import { BaseViewSpecification } from './base-view-specification'

export class WithKanbanField extends BaseViewSpecification {
  constructor(public readonly view: View, public readonly fieldKey: FieldKey | null) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.kanbanFieldId.mapOr(false, (fieldKey) => !!this.fieldKey && fieldKey.equals(this.fieldKey))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateKanban().fieldKey = this.fieldKey ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.kanbanFieldEqual(this)
    return Ok(undefined)
  }
}
