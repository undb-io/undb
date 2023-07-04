import { isArray } from 'lodash-es'
import { z } from 'zod'
import type { Option } from '../../../option/option.js'
import { Options } from '../../../option/options.js'
import type { IRecordDisplayValues, RecordValueJSON } from '../../../record/index.js'
import { AbstractSelectField } from '../../field.base.js'
import type { IFieldVisitor } from '../../field.visitor.js'
import { FieldId } from '../../value-objects/field-id.vo.js'
import { MultiSelectFieldValue } from './multi-select-field-value.js'
import type {
  ICreateMultiSelectFieldSchema,
  ICreateMultiSelectFieldValue,
  IMultiSelectField,
  MultiSelectFieldType,
} from './multi-select-field.type.js'
import type { IMultiSelectFilter, IMultiSelectFilterOperator, IMultiSelectFilterValue } from './multi-select.filter.js'

export class MultiSelectField extends AbstractSelectField<IMultiSelectField> {
  duplicate(name: string): MultiSelectField {
    return MultiSelectField.create({
      ...this.json,
      options: this.options.options.map((option) => option.duplicate().toJSON()),
      id: FieldId.createId(),
      name,
      display: false,
    })
  }

  type: MultiSelectFieldType = 'multi-select'

  override get json() {
    return {
      ...super.json,
      options: this.options.options.map((option) => option.toJSON()),
    }
  }

  static create(input: Omit<ICreateMultiSelectFieldSchema, 'type'>): MultiSelectField {
    return new MultiSelectField({
      ...super.createBase(input),
      options: Options.create(input.options),
    })
  }

  static unsafeCreate(input: ICreateMultiSelectFieldSchema): MultiSelectField {
    return new MultiSelectField({
      ...super.unsafeCreateBase(input),
      options: Options.unsafeCreate(input.options),
    })
  }

  getDisplayValue(valueJson: RecordValueJSON, displayValues?: IRecordDisplayValues): string | number | null {
    const optionIds: string[] = valueJson[this.id.value] ?? []
    return optionIds
      .map((optionId) => this.options.getById(optionId).into()?.name.value)
      .filter(Boolean)
      .toString()
  }

  createFilter(operator: IMultiSelectFilterOperator, value: IMultiSelectFilterValue): IMultiSelectFilter {
    return { operator, value, path: this.id.value, type: 'multi-select' }
  }

  createValue(value: ICreateMultiSelectFieldValue): MultiSelectFieldValue {
    if (value === null) {
      return new MultiSelectFieldValue(null)
    }
    if (!isArray(value)) return new MultiSelectFieldValue(null)

    const options = value.map((optionId) => this.options.getById(optionId).into(null)).filter(Boolean) as Option[]

    return MultiSelectFieldValue.fromOptions(options)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.multiSelect(this)
  }

  get valueSchema() {
    return this.required ? z.string().array().min(1) : z.string().array().nullable()
  }
}
