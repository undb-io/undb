import type { ICreateTableInput } from '@egodb/core'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectFieldControl } from '../../field-inputs/select-field-control'

interface IProps {
  index: number
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const form = useFormContext<ICreateTableInput>()
  const type = form.watch(`schema.${index}.type`)

  if (type === 'select') {
    return (
      <Controller
        name={`schema.${index}.options`}
        render={(props) => <SelectFieldControl onChange={(options) => props.field.onChange(options)} />}
      />
    )
  }

  return null
}
