import { isString } from 'lodash-es'
import { None, Some, type Option } from 'oxide.ts'
import { z } from 'zod'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues, Records } from '../../../record/record.type.js'
import type { TableCompositeSpecification } from '../../../specifications/interface.js'
import { BaseField } from '../../field.base.js'
import type { Field } from '../../field.type.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { WithCurrencySymbol } from '../../specifications/currency-field.specification.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { CurrencyFieldValue } from './currency-field-value.js'
import type {
  CurrencyFieldType,
  ICreateCurrencyFieldInput,
  ICreateCurrencyFieldValue,
  ICurrencyField,
  IUpdateCurrencyFieldInput,
} from './currency-field.type.js'
import { CurrencySymbol } from './currency-symbol.vo.js'
import type { ICurrencyFilter, ICurrencyFilterOperator } from './currency.filter.js'

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

  override toEvent(rs: Records) {
    return {
      ...super.toEvent(rs),
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

  private updateCurrencySymbol(input: IUpdateCurrencyFieldInput): Option<TableCompositeSpecification> {
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
