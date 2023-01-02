import type { Field, IDateFilterOperator, IFieldValue, IOperator } from '@egodb/core'
import { DateRangeField } from '@egodb/core'
import { SelectField } from '@egodb/core'
import { StringField } from '@egodb/core'
import { dateBuiltInOperators } from '@egodb/core'
import { DateField } from '@egodb/core'
import { NumberField } from '@egodb/core'
import type { IDateRangeFieldValue } from '@egodb/core/field/date-range-field.type'
import { DatePicker, DateRangePicker, NumberInput, TextInput } from '@egodb/ui'
import { OptionPicker } from '../option/option-picker'

interface IProps {
  field: Field | null
  operator: IOperator | null
  value: IFieldValue
  onChange: (v: IFieldValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ operator, field, value, onChange }) => {
  if (!field) {
    return null
  }

  if (field instanceof StringField) {
    return <TextInput value={(value ?? '') as string} onChange={(event) => onChange(event.target.value)} />
  }

  if (field instanceof NumberField) {
    return <NumberInput onChange={(number) => onChange(number || null)} />
  }

  if (field instanceof DateField) {
    if (dateBuiltInOperators.has(operator as IDateFilterOperator)) {
      return null
    }
    return <DatePicker onChange={(date) => onChange(date || null)} />
  }

  if (field instanceof DateRangeField) {
    return (
      <DateRangePicker
        value={(value as IDateRangeFieldValue) ?? undefined}
        onChange={(range) => {
          if (range.at(0) !== null && range.at !== null) {
            return onChange((range as IDateRangeFieldValue) || null)
          }
        }}
      />
    )
  }

  if (field instanceof SelectField) {
    return <OptionPicker field={field} onChange={(option) => onChange(option || null)} />
  }

  return null
}
