import { SelectFieldControl } from '../../fields/field-control'
import { useCreateTableFormContext } from '../create-table-form-context'

interface IProps {
  index: number
}

export const FieldVariantControl: React.FC<IProps> = ({ index }) => {
  const form = useCreateTableFormContext()
  const field = form.values.schema[index]

  if (field.type === 'select') {
    return <SelectFieldControl onChange={(options) => form.setFieldValue(`schema.${index}.options`, options)} />
  }

  return null
}
