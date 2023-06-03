import { isString } from 'lodash-es'
import { None, Some, type Option } from 'oxide.ts'
import { z } from 'zod'
import type { ICurrencyFilter, ICurrencyFilterOperator } from '../filter/currency.filter.js'
import type { IRecordDisplayValues, RecordValueJSON } from '../record/index.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { CurrencyFieldValue } from './currency-field-value.js'
import type {
  CurrencyFieldType,
  ICreateCurrencyFieldInput,
  ICreateCurrencyFieldValue,
  IUpdateCurrencyFieldInput,
} from './currency-field.type.js'
import { CurrencySymbol } from './currency-symbol.vo.js'
import { BaseField } from './field.base.js'
import type { Field, ICurrencyField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { WithCurrencySymbol } from './specifications/currency-field.specification.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class CurrencyField extends BaseField<ICurrencyField> {
  duplicate(name: string): Field {
    return CurrencyField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: CurrencyFieldType = 'currency'

  override get json() {
    return {
      ...super.json,
      symbol: this.symbol.symbol,
    }
  }

  override get primitive() {
    return true
  }

  public get symbol() {
    return this.props.symbol
  }

  public set symbol(symbol: CurrencySymbol) {
    this.props.symbol = symbol
  }

  static create(input: Omit<ICreateCurrencyFieldInput, 'type'>): CurrencyField {
    return new CurrencyField({ ...super.createBase(input), symbol: new CurrencySymbol({ value: input.symbol }) })
  }

  static unsafeCreate(input: ICreateCurrencyFieldInput): CurrencyField {
    return new CurrencyField({ ...super.unsafeCreateBase(input), symbol: new CurrencySymbol({ value: input.symbol }) })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const value = valueJson[this.id.value] ?? null
    if (!value) return null

    return this.symbol.symbol + ' ' + value
  }

  createValue(value: ICreateCurrencyFieldValue): CurrencyFieldValue {
    return new CurrencyFieldValue(value)
  }

  createFilter(operator: ICurrencyFilterOperator, value: number | null): ICurrencyFilter {
    return { operator, value, path: this.id.value, type: 'currency' }
  }

  private updateCurrencySymbol(input: IUpdateCurrencyFieldInput): Option<TableCompositeSpecificaiton> {
    if (isString(input.symbol)) {
      return Some(new WithCurrencySymbol(this.type, this.id.value, new CurrencySymbol({ value: input.symbol })))
    }
    return None
  }

  accept(visitor: IFieldVisitor): void {
    visitor.currency(this)
  }

  get valueSchema() {
    const currency = z.number()
    return this.required ? currency : currency.nullable()
  }
}
