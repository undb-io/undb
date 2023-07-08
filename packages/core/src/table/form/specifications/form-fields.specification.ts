import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications'
import type { Table } from '../../table'
import type { FormFields } from '../form-fields.vo'

export class WithFormFieldsSpecification extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly formId: string, public readonly fields: FormFields) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    const form = t.forms.getById(this.formId)
    if (form.isSome()) {
      form.unwrap().fields = this.fields
    }

    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.formFieldsEqual(this)
    return Ok(undefined)
  }
}
