import type { Field, IFieldValue } from '@egodb/core'
import type { Table } from '@egodb/core'
import { NumberInput, DatePicker, DateRangePicker, Checkbox, TextInput } from '@egodb/ui'
import React from 'react'
import { FieldInputLabel } from '../fields/field-input-label'
import { OptionPicker } from '../option/option-picker'

interface IProps {
  table: Table
  field: Field
  value: IFieldValue
  props: any
}

export const RecordInputFactory: React.FC<IProps> = ({ props, table, value, field }) => {
  const label = <FieldInputLabel>{field.id.value}</FieldInputLabel>
  if (field.type === 'number') {
    return <NumberInput {...props} value={value} label={label} />
  }
  if (field.type === 'date') {
    return <DatePicker key={field.id.value} {...props} value={value} label={label} />
  }
  if (field.type === 'date-range') {
    return <DateRangePicker key={field.id.value} {...props} value={value} label={label} />
  }
  if (field.type === 'bool') {
    return <Checkbox lh={1} key={field.id.value} {...props} value={value} label={label} />
  }
  if (field.type === 'select') {
    return <OptionPicker field={field} table={table} key={field.id.value} {...props} value={value} label={label} />
  }
  return <TextInput key={field.id.value} {...props} value={value} label={label} />
}
