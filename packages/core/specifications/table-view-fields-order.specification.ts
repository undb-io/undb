import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { View, ViewFieldsOrder } from '../view'

export class WithViewFieldsOrder extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly viewFieldsOrder: ViewFieldsOrder, public readonly view: View) {
    super()
  }

  isSatisfiedBy(): boolean {
    return this.viewFieldsOrder.equals(this.view.fieldsOrder)
  }

  mutate(t: Table): Result<Table, string> {
    this.view.fieldsOrder = this.viewFieldsOrder
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.fieldsOrder(this)
    return Ok(undefined)
  }
}
