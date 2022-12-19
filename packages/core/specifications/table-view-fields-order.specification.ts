import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { ViewFieldsOrder } from '../view'

export class WithViewFieldsOrder extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly viewFieldsOrder: ViewFieldsOrder, public readonly viewName?: string) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    return this.viewFieldsOrder.equals(t.getOrCreateDefaultView(this.viewName).fieldsOrder)
  }

  mutate(t: Table): Result<Table, string> {
    t.getOrCreateDefaultView(this.viewName).fieldsOrder = this.viewFieldsOrder
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.fieldsOrder(this)
    return Ok(undefined)
  }
}
