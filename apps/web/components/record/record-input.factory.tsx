import type { Field } from '@egodb/core'
import { NumberInput, DatePicker, DateRangePicker, Checkbox, TextInput } from '@egodb/ui'
import React from 'react'
import { FieldInputLabel } from '../fields/field-input-label'
import { OptionPicker } from '../option/option-picker'

interface IProps {
  field: Field
  props: any
}

export const RecordInputFactory: React.FC<IProps> = ({ props, field }) => {
  const label = <FieldInputLabel>{field.name.value}</FieldInputLabel>
  if (field.type === 'number') {
    return <NumberInput {...props} label={label} />
  }
  if (field.type === 'date') {
    return <DatePicker key={field.id.value} {...props} label={label} />
  }
  if (field.type === 'date-range') {
    return <DateRangePicker key={field.id.value} {...props} value={props.value || [null, null]} label={label} />
  }
  if (field.type === 'bool') {
    return <Checkbox key={field.id.value} {...props} label={label} />
  }
  if (field.type === 'select') {
    return <OptionPicker field={field} key={field.id.value} {...props} label={label} />
  }
  return <TextInput key={field.id.value} {...props} label={label} />
}
