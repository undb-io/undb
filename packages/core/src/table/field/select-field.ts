import { andOptions } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'
import type { ISelectFilterOperator } from '../filter/operators.js'
import type { ISelectFilter, ISelectFilterValue } from '../filter/select.filter.js'
import { Options } from '../option/options.js'
import type { TableCompositeSpecificaiton } from '../specifications/interface.js'
import { AbstractSelectField } from './field.base.js'
import type { ISelectField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { SelectFieldValue } from './select-field-value.js'
import type {
  ICreateSelectFieldSchema,
  ICreateSelectFieldValue,
  IUpdateSelectFieldInput,
  SelectFieldType,
} from './select-field.type.js'
import { FieldId } from './value-objects/field-id.vo.js'

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

  public override update(input: IUpdateSelectFieldInput): Option<TableCompositeSpecificaiton> {
    return andOptions(this.updateBase(input), super.updateOptions(input.options ?? []))
  }

  createFilter(operator: ISelectFilterOperator, value: ISelectFilterValue): ISelectFilter {
    return { operator, value, path: this.id.value, type: 'select' }
  }

  createValue(value: ICreateSelectFieldValue): SelectFieldValue {
    if (value === null) {
      return new SelectFieldValue(null)
    }

    const option = this.options.getById(value).unwrap()

    return SelectFieldValue.fromOption(option)
  }

  accept(visitor: IFieldVisitor): void {
    visitor.select(this)
  }

  get valueSchema() {
    return this.required ? z.string() : z.string().nullable()
  }
}
