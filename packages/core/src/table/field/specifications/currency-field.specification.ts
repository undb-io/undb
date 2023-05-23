import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { CurrencyField } from '../currency-field.js'
import type { CurrencySymbol } from '../currency-symbol.vo.js'

export class WithCurrencySymbol extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly field: CurrencyField, public readonly symbol: CurrencySymbol) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    return this.symbol.equals(this.field.symbol)
  }
  mutate(t: Table): Result<Table, string> {
    this.field.symbol = this.symbol
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.currencySymbolEqual(this)
    return Ok(undefined)
  }
}
