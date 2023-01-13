import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldId } from '../../field'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'

export class WithCalendarField extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly view: View, public readonly fieldId: FieldId | null) {
    super()
  }

  isSatisfiedBy(): boolean {
    return this.view.calendarFieldId.mapOr(false, (fieldId) => !!this.fieldId && fieldId.equals(this.fieldId))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateCalendar().fieldId = this.fieldId ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.calendarFieldEqual(this)
    return Ok(undefined)
  }
}
