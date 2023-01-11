import type { ICreateFieldSchema } from '@egodb/core'
import { useFormContext } from 'react-hook-form'
import { SelectFieldControl } from '../fields/select-field-control'

export const CreateFieldVariantControl: React.FC = () => {
  const form = useFormContext<ICreateFieldSchema>()
  const type = form.getValues('type')

  if (type === 'select') {
    return <SelectFieldControl onChange={(options) => form.setValue('options', options)} />
  }

  return null
}
