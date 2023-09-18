import type { Field, ICreateFieldSchema } from './field.type.js'
import { CountField } from './fields/count/count-field.js'
import { CreatedAtField } from './fields/created-at/created-at-field.js'
import { CreatedByField } from './fields/created-by/created-by-field.js'
import { DateRangeField } from './fields/date-range/date-range-field.js'
import { DateField } from './fields/date/date-field.js'
import { IdField } from './fields/id/id-field.js'
import {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CurrencyField,
  EmailField,
  QRCodeField,
  StringField,
  UrlField,
} from './fields/index.js'
import { JsonField } from './fields/json/json-field.js'
import { LookupField } from './fields/lookup/lookup-field.js'
import { MaxField } from './fields/max/max-field.js'
import { MinField } from './fields/min/min-field.js'
import { MultiSelectField } from './fields/multi-select/multi-select-field.js'
import { NumberField } from './fields/number/number-field.js'
import { ParentField } from './fields/parent/parent-field.js'
import { RatingField } from './fields/rating/rating-field.js'
import { ReferenceField } from './fields/reference/reference-field.js'
import { SelectField } from './fields/select/select-field.js'
import { SumField } from './fields/sum/sum-field.js'
import { TreeField } from './fields/tree/tree-field.js'
import { UpdatedAtField } from './fields/updated-at/updated-at-field.js'
import { UpdatedByField } from './fields/updated-by/updated-by-field.js'

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
      case 'min': {
        return MinField.create(input)
      }
      case 'max': {
        return MaxField.create(input)
      }
      case 'qrcode': {
        return QRCodeField.create(input)
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
      case 'min': {
        return MinField.unsafeCreate(input)
      }
      case 'max': {
        return MaxField.unsafeCreate(input)
      }
      case 'qrcode': {
        return QRCodeField.unsafeCreate(input)
      }
    }
  }
}
