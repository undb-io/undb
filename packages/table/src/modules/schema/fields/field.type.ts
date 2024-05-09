import type { NumberFieldValue } from './variants/number-field/number-field-value.vo'
import type { NumberField } from './variants/number-field/number-field.vo'
import type { StringFieldValue } from './variants/string-field/string-field-value.vo'
import type { StringField } from './variants/string-field/string-field.vo'

export type Field = StringField | NumberField
export type FieldValue = StringFieldValue | NumberFieldValue
