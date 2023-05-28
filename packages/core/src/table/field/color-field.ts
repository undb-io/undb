import { z } from 'zod'
import type { IColorFilter, IColorFilterOperator } from '../filter/color.filter.js'
import { ColorFieldValue } from './color-field-value.js'
import type { ColorFieldType, ICreateColorFieldInput, ICreateColorFieldValue } from './color-field.type.js'
import { BaseField } from './field.base.js'
import type { Field, IColorField } from './field.type.js'
import type { IFieldVisitor } from './field.visitor.js'
import { FieldId } from './value-objects/field-id.vo.js'

export class ColorField extends BaseField<IColorField> {
  duplicate(name: string): Field {
    return ColorField.create({
      ...this.json,
      id: FieldId.createId(),
      name,
      display: false,
    })
  }
  type: ColorFieldType = 'color'

  override get primitive() {
    return true
  }

  static create(input: Omit<ICreateColorFieldInput, 'type'>): ColorField {
    return new ColorField(super.createBase(input))
  }

  static unsafeCreate(input: ICreateColorFieldInput): ColorField {
    return new ColorField(super.unsafeCreateBase(input))
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

  get valueSchema() {
    const color = z.string().min(4).max(9).regex(/^#/)
    return this.required ? color : color.nullable().or(z.string().length(0))
  }
}
