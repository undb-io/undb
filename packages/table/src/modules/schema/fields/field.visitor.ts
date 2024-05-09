import type { NumberField } from './variants/number-field/number-field.vo'
import type { StringField } from './variants/string-field/string-field.vo'

export interface IFieldVisitor {
  string(field: StringField): void
  number(field: NumberField): void
}
