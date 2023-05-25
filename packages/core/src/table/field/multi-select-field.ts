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
import type { MultiSelectFieldValue } from './multi-select-field-value.js'
import type {
  ICreateMultiSelectFieldSchema,
  ICreateMultiSelectFieldValue,
  IUpdateMultiSelectFieldInput,
  MultiSelectFieldType,
} from './multi-select-field.type.js'

export class MultiSelectField extends AbstractSelectField<IMultiSelectField> {
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
    throw new Error('wtf')
    // if (value === null) {
    //   return new MultiSelectFieldValue(null)
    // }

    // const option = this.options.getById(value).unwrap()

    // return MultiSelectFieldValue.fromOption(option)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.multiSelect(this)
  }

  get valueSchema() {
    return this.required ? z.string() : z.string().nullable()
  }
}
