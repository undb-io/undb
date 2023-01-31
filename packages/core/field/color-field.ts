import type { IColorFilter, IColorFilterOperator } from '../filter/color.filter'
import { ColorFieldValue } from './color-field-value'
import type { ColorFieldType, ICreateColorFieldInput, ICreateColorFieldValue } from './color-field.type'
import { BaseField } from './field.base'
import type { IColorField } from './field.type'
import type { IFieldVisitor } from './field.visitor'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export class ColorField extends BaseField<IColorField> {
  type: ColorFieldType = 'color'

  static create(input: ICreateColorFieldInput): ColorField {
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
