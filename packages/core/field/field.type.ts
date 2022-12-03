import type { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export interface IBaseField {
  id: FieldId
  name: FieldName
  valueConstrains: FieldValueConstraints
}

export type ITextField = IBaseField
export type INumberField = IBaseField

import type { NumberField } from './number.field'
import type { TextField } from './text.field'

export type Field = TextField | NumberField
