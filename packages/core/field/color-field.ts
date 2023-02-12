import type { IColorFilter, IColorFilterOperator } from '../filter/color.filter.js'
import { ColorFieldValue } from './color-field-value.js'
import type { ColorFieldType, ICreateColorFieldInput, ICreateColorFieldValue } from './color-field.type.js'
import { BaseField } from './field.base.js'
import type { IColorField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects/index.js'

export class ColorField extends BaseField<IColorField> {
  type: ColorFieldType = 'color'

  static create(input: Omit<ICreateColorFieldInput, 'type'>): ColorField {
    const fieldName = FieldName.create(input.name)

    return new ColorField({
      id: FieldId.fromNullableString(input.id),
      name: fieldName,
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateColorFieldInput): ColorField {
    return new ColorField({
      id: FieldId.fromNullableString(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }

  createValue(value: ICreateColorFieldValue): ColorFieldValue {
    return new ColorFieldValue(value)
  }

  createFilter(operator: IColorFilterOperator, value: string | null): IColorFilter {
    return { operator, value, path: this.id.value, type: 'color' }
  }

  accept(visitor: IFieldVisitor): void {
    visitor.color(this)
  }
}
