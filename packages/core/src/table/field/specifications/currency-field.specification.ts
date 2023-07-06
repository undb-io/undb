import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '../../specifications/index.js'
import type { Table } from '../../table.js'
import type { CurrencyField } from '../fields/currency/currency-field.js'
import type { CurrencyFieldType } from '../fields/currency/currency-field.type.js'
import type { CurrencySymbol } from '../fields/currency/currency-symbol.vo.js'

export class WithCurrencySymbol extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(
    public readonly type: CurrencyFieldType,
    public readonly fieldId: string,
    public readonly symbol: CurrencySymbol,
  ) {
    super()
  }

  isSatisfiedBy(t: Table): boolean {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as CurrencyField
    return this.symbol.equals(field.symbol)
  }
  mutate(t: Table): Result<Table, string> {
    const field = t.schema.getFieldById(this.fieldId).unwrap() as CurrencyField
    field.symbol = this.symbol
    return Ok(t)
  }
  accept(v: ITableSpecVisitor): Result<void, string> {
    v.currencySymbolEqual(this)
    return Ok(undefined)
  }
}
