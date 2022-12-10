import type { Field, IFieldValue } from '@egodb/core'
import { NumberField } from '@egodb/core'
import { TextField } from '@egodb/core'
import { NumberInput, TextInput } from '@egodb/ui'
import { FieldInputLabel } from '../fields/field-input-label'

interface IProps {
  field: Field | null
  onChange: (v: IFieldValue) => void
}

export const FilterValueInput: React.FC<IProps> = ({ field, onChange }) => {
  if (!field) {
    return null
  }

  const label = <FieldInputLabel>value</FieldInputLabel>

  if (field instanceof TextField) {
    return <TextInput label={label} onChange={(event) => onChange(event.target.value)} />
  }

  if (field instanceof NumberField) {
    return <NumberInput label={label} onChange={(number) => onChange(number || null)} />
  }

  return null
}
