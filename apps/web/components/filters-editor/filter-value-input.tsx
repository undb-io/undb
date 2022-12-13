import type { Field, IFieldValue } from '@egodb/core'
import { NumberField } from '@egodb/core'
import { TextField } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'

interface IProps {
  field: Field | null
  value: IFieldValue
  onChange: (v: IFieldValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ field, value, onChange }) => {
  if (!field) {
    return null
  }

  if (field instanceof TextField) {
    return <TextInput value={(value ?? '') as string} onChange={(event) => onChange(event.target.value)} />
  }

  if (field instanceof NumberField) {
    return <NumberInput onChange={(number) => onChange(number || null)} />
  }

  return null
}
