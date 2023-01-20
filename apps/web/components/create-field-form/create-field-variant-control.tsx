import type { ICreateFieldSchema } from '@egodb/core'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectFieldControl } from '../field-inputs/select-field-control'

export const CreateFieldVariantControl: React.FC = () => {
  const form = useFormContext<ICreateFieldSchema>()
  const type = form.watch('type')

  if (type === 'select') {
    return (
      <Controller
        name="options"
        render={(props) => <SelectFieldControl onChange={(options) => props.field.onChange(options)} />}
      />
    )
  }

  return null
}
