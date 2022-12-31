import { SelectFieldControl } from '../fields/field-control'
import { useCreateFieldFormContext } from './create-field-form-context'

export const CreateFieldVariantControl: React.FC = () => {
  const form = useCreateFieldFormContext()
  const type = form.values.type

  if (type === 'select') {
    return <SelectFieldControl onChange={(options) => form.setFieldValue('options', options)} />
  }

  return null
}
