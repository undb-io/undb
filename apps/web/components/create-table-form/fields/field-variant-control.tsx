import type { ICreateTableInput } from '@egodb/core'
import { useFormContext } from 'react-hook-form'
import { SelectFieldControl } from '../../fields/select-field-control'

interface IProps {
  index: number
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const form = useFormContext<ICreateTableInput>()
  const type = form.watch(`schema.${index}.type`)

  if (type === 'select') {
    return <SelectFieldControl onChange={(options) => form.setValue(`schema.${index}.options`, options)} />
  }

  return null
}
