import { z } from 'zod'
import type { ILookupFilter } from '../filter/lookup.filter.js'
import type { ILookupFilterOperator } from '../filter/operators.js'
import { BaseLookupField } from './field.base.js'
import type { ILookupField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { LookupFieldValue } from './lookup-field-value.js'
import type { ICreateLookupFieldInput, ICreateLookupFieldValue, LookupType } from './lookup-field.type.js'
import { DisplayFields } from './value-objects/display-fields.vo.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class LookupField extends BaseLookupField<ILookupField> {
  type: LookupType = 'lookup'

  override get primitive() {
    return false
  }

  static create(input: Omit<ICreateLookupFieldInput, 'type'>): LookupField {
    return new LookupField({
      ...super.createBase(input),
      displayFields: new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id))),
    })
  }

  static unsafeCreate(input: ICreateLookupFieldInput): LookupField {
    return new LookupField({
      ...super.unsafeCreateBase(input),
      displayFields: new DisplayFields(input.displayFieldIds.map((id) => FieldId.fromString(id))),
    })
  }

  createValue(value: ICreateLookupFieldValue): LookupFieldValue {
    return new LookupFieldValue(value)
  }

  createFilter(operator: ILookupFilterOperator, value: string[] | null): ILookupFilter {
    return { operator, value, path: this.id.value, type: 'lookup' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.lookup(this)
  }

  get valueSchema() {
    return z.string().array().nullable()
  }
}
