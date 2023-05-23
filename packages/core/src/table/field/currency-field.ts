import { andOptions } from '@undb/domain'
import { type Option } from 'oxide.ts'
import { z } from 'zod'
import type { ICurrencyFilter, ICurrencyFilterOperator } from '../filter/currency.filter.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { CurrencyFieldValue } from './currency-field-value.js'
import type {
  CurrencyFieldType,
  ICreateCurrencyFieldInput,
  ICreateCurrencyFieldValue,
  IUpdateCurrencyFieldInput,
} from './currency-field.type.js'
import { BaseField } from './field.base.js'
import type { ICurrencyField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'

export class CurrencyField extends BaseField<ICurrencyField> {
  type: CurrencyFieldType = 'currency'

  override get json() {
    return {
      ...super.json,
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateCurrencyFieldInput, 'type'>): CurrencyField {
    return new CurrencyField({ ...super.createBase(input) })
  }

  static unsafeCreate(input: ICreateCurrencyFieldInput): CurrencyField {
    return new CurrencyField({ ...super.unsafeCreateBase(input) })
  }

  createValue(value: ICreateCurrencyFieldValue): CurrencyFieldValue {
    return new CurrencyFieldValue(value)
  }

  createFilter(operator: ICurrencyFilterOperator, value: number | null): ICurrencyFilter {
    return { operator, value, path: this.id.value, type: 'currency' }
  }

  public update(input: IUpdateCurrencyFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(super.updateBase(input))
  }

  accept(visitor: IFieldVisitor): void {
    visitor.currency(this)
  }

  get valueSchema() {
    const currency = z.number()
    return this.required ? currency : currency.nullable()
  }
}
