import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldKey } from '../../field'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { View } from '../view'
import { BaseViewSpecification } from './base-view-specification'

export class WithCalendarField extends BaseViewSpecification {
  constructor(public readonly view: View, public readonly fieldKey: FieldKey | null) {
    super(view)
  }

  isSatisfiedBy(): boolean {
    return this.view.calendarFieldId.mapOr(false, (fieldKey) => !!this.fieldKey && fieldKey.equals(this.fieldKey))
  }

  mutate(t: Table): Result<Table, string> {
    this.view.getOrCreateCalendar().fieldKey = this.fieldKey ?? undefined
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.calendarFieldEqual(this)
    return Ok(undefined)
  }
}
