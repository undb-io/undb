import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { FormFieldsOrder } from '../form-fields-order.vo.js'

export class WithFormFieldsOrder extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly formId: string, public readonly formFieldsOrder: FormFieldsOrder) {
    super()
  }

  isSatisfiedBy(): boolean {
    throw new Error('Method not implemented.')
  }

  mutate(t: Table): Result<Table, string> {
    const form = t.forms.getById(this.formId)
    if (form.isSome()) {
      form.unwrap().fieldsOrder = this.formFieldsOrder
    }
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.formFieldsOrder(this)
    return Ok(undefined)
  }
}
