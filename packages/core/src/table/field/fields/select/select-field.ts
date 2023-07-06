import { z } from 'zod'
import { Options } from '../../../option/options.js'
import type { RecordValueJSON } from '../../../record/record.schema.js'
import type { IRecordDisplayValues } from '../../../record/record.type.js'
import { AbstractSelectField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { SelectFieldValue } from './select-field-value.js'
import type {
  ICreateSelectFieldSchema,
  ICreateSelectFieldValue,
  ISelectField,
  SelectFieldType,
} from './select-field.type.js'
import type { ISelectFilter, ISelectFilterOperator, ISelectFilterValue } from './select.filter.js'

export class SelectField extends AbstractSelectField<ISelectField> {
  type: SelectFieldType = 'select'
  duplicate(name: string): SelectField {
    return SelectField.create({
      ...this.json,
      options: this.options.options.map((option) => option.duplicate().toJSON()),
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  override get json() {
    return {
      ...super.json,
      options: this.options.options.map((option) => option.toJSON()),
    }
  }

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateSelectFieldSchema, 'type'>): SelectField {
    return new SelectField({
      ...super.createBase(input),
      options: Options.create(input.options),
    })
  }

  static unsafeCreate(input: ICreateSelectFieldSchema): SelectField {
    return new SelectField({
      ...super.unsafeCreateBase(input),
      options: Options.unsafeCreate(input.options),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | null {
    const optionId = valueJson[this.id.value]
    if (!optionId) return null

    const option = this.options.getById(optionId).into()
    if (!option) return null

    return option.name.value
  }

  createFilter(operator: ISelectFilterOperator, value: ISelectFilterValue): ISelectFilter {
    return { operator, value, path: this.id.value, type: 'select' }
  }

  createValue(value: ICreateSelectFieldValue): SelectFieldValue {
    if (value === null) {
      return new SelectFieldValue(null)
    }

    const option = this.options.getById(value).into(null) ?? this.options.getByName(value).into(null)
    if (!option) {
      return new SelectFieldValue(null)
    }

    return SelectFieldValue.fromOption(option)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.select(this)
  }

  get valueSchema() {
    return this.required ? z.string() : z.string().nullable()
  }
}
