import type { Field, IDateFilterOperator, IFieldValue, IOperator } from '@egodb/core'
import { SelectField } from '@egodb/core'
import { StringField } from '@egodb/core'
import { dateBuiltInOperators } from '@egodb/core'
import { DateField } from '@egodb/core'
import { NumberField } from '@egodb/core'
import { DatePicker, NumberInput, TextInput } from '@egodb/ui'
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

  if (field instanceof SelectField) {
    return <OptionPicker field={field} onChange={(option) => onChange(option || null)} />
  }

  return null
}
