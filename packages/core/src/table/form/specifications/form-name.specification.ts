import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { FormName } from '../form-name.vo.js'

export class WithFormName extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly formId: string, public readonly name: FormName) {
    super()
  }
  isSatisfiedBy(t: Table): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Table): Result<Table, string> {
    const form = t.forms.getById(this.formId).unwrap()

    form.name = this.name

    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.withFormName(this)

    return Ok(undefined)
  }
}
