import { AttachmentField } from './attachment-field.js'
import { AutoIncrementField } from './auto-increment-field.js'
import { AverageField } from './average-field.js'
import { BoolField } from './bool-field.js'
import { CollaboratorField } from './collaborator-field.js'
import { ColorField } from './color-field.js'
import { CountField } from './count-field.js'
import { CreatedAtField } from './created-at-field.js'
import { CreatedByField } from './created-by-field.js'
import { CurrencyField } from './currency-field.js'
import { DateField } from './date-field.js'
import { DateRangeField } from './date-range-field.js'
import type { Field, ICreateFieldSchema } from './field.type.js'
import { EmailField, StringField, UrlField } from './fields/index.js'
import { IdField } from './id-field.js'
import { JsonField } from './json-field.js'
import { LookupField } from './lookup-field.js'
import { MultiSelectField } from './multi-select-field.js'
import { NumberField } from './number-field.js'
import { ParentField } from './parent-field.js'
import { RatingField } from './rating-field.js'
import { ReferenceField } from './reference-field.js'
import { SelectField } from './select-field.js'
import { SumField } from './sum-field.js'
import { TreeField } from './tree-field.js'
import { UpdatedAtField } from './updated-at-field.js'
import { UpdatedByField } from './updated-by-field.js'

export class FieldFactory {
  static create(input: ICreateFieldSchema): Field | Field[] {
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
      case 'auto-increment': {
        return AutoIncrementField.create(input)
      }
      case 'string': {
        return StringField.create(input)
      }
      case 'email': {
        return EmailField.create(input)
      }
      case 'url': {
        return UrlField.create(input)
      }
      case 'json': {
        return JsonField.create(input)
      }
      case 'color': {
        return ColorField.create(input)
      }
      case 'number': {
        return NumberField.create(input)
      }
      case 'rating': {
        return RatingField.create(input)
      }
      case 'currency': {
        return CurrencyField.create(input)
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
      case 'multi-select': {
        return MultiSelectField.create(input)
      }
      case 'bool': {
        return BoolField.create(input)
      }
      case 'reference': {
        return ReferenceField.create(input)
      }
      case 'tree': {
        const treeField = TreeField.create(input)
        return [treeField, treeField.createParentField(input.parentFieldName)]
      }
      case 'parent': {
        return ParentField.create(input)
      }
      case 'count': {
        return CountField.create(input)
      }
      case 'sum': {
        return SumField.create(input)
      }
      case 'average': {
        return AverageField.create(input)
      }
      case 'lookup': {
        return LookupField.create(input)
      }
      case 'attachment': {
        return AttachmentField.create(input)
      }
      case 'collaborator': {
        return CollaboratorField.create(input)
      }
      case 'created-by': {
        return CreatedByField.create(input)
      }
      case 'updated-by': {
        return UpdatedByField.create(input)
      }
      default: {
        throw new Error()
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
      case 'auto-increment': {
        return AutoIncrementField.unsafeCreate(input)
      }
      case 'string': {
        return StringField.unsafeCreate(input)
      }
      case 'email': {
        return EmailField.unsafeCreate(input)
      }
      case 'url': {
        return UrlField.unsafeCreate(input)
      }
      case 'json': {
        return JsonField.unsafeCreate(input)
      }
      case 'color': {
        return ColorField.unsafeCreate(input)
      }
      case 'number': {
        return NumberField.unsafeCreate(input)
      }
      case 'rating': {
        return RatingField.unsafeCreate(input)
      }
      case 'currency': {
        return CurrencyField.unsafeCreate(input)
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
      case 'multi-select': {
        return MultiSelectField.unsafeCreate(input)
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
      case 'parent': {
        return ParentField.unsafeCreate(input)
      }
      case 'count': {
        return CountField.unsafeCreate(input)
      }
      case 'sum': {
        return SumField.unsafeCreate(input)
      }
      case 'average': {
        return AverageField.unsafeCreate(input)
      }
      case 'lookup': {
        return LookupField.unsafeCreate(input)
      }
      case 'attachment': {
        return AttachmentField.unsafeCreate(input)
      }
      case 'collaborator': {
        return CollaboratorField.unsafeCreate(input)
      }
      case 'created-by': {
        return CreatedByField.unsafeCreate(input)
      }
      case 'updated-by': {
        return UpdatedByField.unsafeCreate(input)
      }
      default: {
        throw new Error()
      }
    }
  }
}
