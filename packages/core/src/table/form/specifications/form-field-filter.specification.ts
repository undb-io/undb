import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IRootFilter } from '../../filter/filter.js'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'

export class WithFormFieldFilter extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly formId: string,
    public readonly fieldId: string,
    public readonly filter: IRootFilter | null,
  ) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    const form = t.forms.getById(this.formId)
    if (form.isSome()) {
      const field = form.unwrap().fields.value.get(this.fieldId)
      if (field) {
        field.filter = this.filter
      }
    }

    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFormFieldFilter(this)
    return Ok(undefined)
  }
}
