import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import type { IMultiSelectFilter, IMultiSelectFilterValue } from '../filter/multi-select.filter.js'
import type { IMultiSelectFilterOperator } from '../filter/operators.js'
import { Options } from '../option/options.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { AbstractSelectField } from './field.base.js'
import type { IMultiSelectField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { MultiSelectFieldValue } from './multi-select-field-value.js'
import type {
  ICreateMultiSelectFieldSchema,
  ICreateMultiSelectFieldValue,
  IUpdateMultiSelectFieldInput,
  MultiSelectFieldType,
} from './multi-select-field.type.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class MultiSelectField extends AbstractSelectField<IMultiSelectField> {
  duplicate(name: string): MultiSelectField {
    return MultiSelectField.create({
      ...this.json,
      options: this.options.options.map((option) => option.duplicate().toJSON()),
      id: FieldId.createId(),
      name,
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

  public override update(input: IUpdateMultiSelectFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), super.updateOptions(input.options ?? []))
  }

  createFilter(operator: IMultiSelectFilterOperator, value: IMultiSelectFilterValue): IMultiSelectFilter {
    return { operator, value, path: this.id.value, type: 'multi-select' }
  }

  createValue(value: ICreateMultiSelectFieldValue): MultiSelectFieldValue {
    if (value === null) {
      return new MultiSelectFieldValue(null)
    }

    const options = value.map((optionId) => this.options.getById(optionId).unwrap())

    return MultiSelectFieldValue.fromOptions(options)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.multiSelect(this)
  }

  get valueSchema() {
    return this.required ? z.string().array().min(1) : z.string().array().nullable()
  }
}
