import { BoolField } from './bool-field'
import { CreatedAtField } from './created-at-field'
import { DateField } from './date-field'
import { DateRangeField } from './date-range-field'
import type { Field, ICreateFieldSchema } from './field.type'
import { IdField } from './id-field'
import { NumberField } from './number-field'
import { ReferenceField } from './reference-field'
import { SelectField } from './select-field'
import { StringField } from './string-field'
import { TreeField } from './tree-field'
import { UpdatedAtField } from './updated-at-field'

export class FieldFactory {
  static create(input: ICreateFieldSchema): Field {
    switch (input.type) {
      case 'id': {
        return IdField.create(input)
      }
      case 'created-at': {
        return CreatedAtField.create(input)
      }
      case 'updated-at': {
        return UpdatedAtField.create(input)
      }
      case 'string': {
        return StringField.create(input)
      }
      case 'number': {
        return NumberField.create(input)
      }
      case 'date': {
        return DateField.create(input)
      }
      case 'date-range': {
        return DateRangeField.create(input)
      }
      case 'select': {
        return SelectField.create(input)
      }
      case 'bool': {
        return BoolField.create(input)
      }
      case 'reference': {
        return ReferenceField.create(input)
      }
      case 'tree': {
        return TreeField.create(input)
      }
    }
  }

  static unsafeCreate(input: ICreateFieldSchema): Field {
    switch (input.type) {
      case 'id': {
        return IdField.unsafeCreate(input)
      }
      case 'created-at': {
        return CreatedAtField.unsafeCreate(input)
      }
      case 'updated-at': {
        return UpdatedAtField.unsafeCreate(input)
      }
      case 'string': {
        return StringField.unsafeCreate(input)
      }
      case 'number': {
        return NumberField.unsafeCreate(input)
      }
      case 'date': {
        return DateField.unsafeCreate(input)
      }
      case 'date-range': {
        return DateRangeField.unsafeCreate(input)
      }
      case 'select': {
        return SelectField.unsafeCreate(input)
      }
      case 'bool': {
        return BoolField.unsafeCreate(input)
      }
      case 'reference': {
        return ReferenceField.unsafeCreate(input)
      }
      case 'tree': {
        return TreeField.unsafeCreate(input)
      }
    }
  }
}
