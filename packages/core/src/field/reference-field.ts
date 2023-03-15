import { Option } from 'oxide.ts'
import { z } from 'zod'
import type { IReferenceFilterOperator } from '../filter/operators.js'
import type { IReferenceFilter } from '../filter/reference.filter.js'
import { TableId } from '../value-objects/table-id.vo.js'
import { BaseReferenceField } from './field.base.js'
import type { IReferenceField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { ReferenceFieldValue } from './reference-field-value.js'
import type {
  ICreateReferenceFieldInput,
  ICreateReferenceFieldValue,
  ReferenceFieldType,
} from './reference-field.type.js'

export class ReferenceField extends BaseReferenceField<IReferenceField> {
  type: ReferenceFieldType = 'reference'

  override get foreignTableId(): Option<string> {
    return Option(this.props.foreignTableId?.value)
  }

  static create(input: Omit<ICreateReferenceFieldInput, 'type'>): ReferenceField {
    return new ReferenceField({
      ...super.createBase(input),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
    })
  }

  static unsafeCreate(input: ICreateReferenceFieldInput): ReferenceField {
    return new ReferenceField({
      ...super.unsafeCreateBase(input),
      foreignTableId: input.foreignTableId ? TableId.from(input.foreignTableId).unwrap() : undefined,
    })
  }

  createValue(value: ICreateReferenceFieldValue): ReferenceFieldValue {
    return new ReferenceFieldValue(value)
  }

  createFilter(operator: IReferenceFilterOperator, value: null): IReferenceFilter {
    return { operator, value, path: this.id.value, type: 'reference' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.reference(this)
  }

  get valueSchema() {
    return this.required ? z.string().array() : z.string().array().nullable()
  }
}
