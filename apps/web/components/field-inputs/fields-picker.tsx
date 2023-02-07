import type { MultiSelectProps } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { FieldInputLabel } from './field-input-label'
import type { FieldBase } from './field-picker.type'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  fields: FieldBase[]
}

export const FieldsPicker: React.FC<IProps> = ({ fields, ...rest }) => {
  const data = fields.map((f, index) => ({ value: f.id, label: f.name || `Field ` + (index + 1) }))

  return (
    <MultiSelect
      placeholder="select display fields"
      variant="filled"
      label={<FieldInputLabel>Display Fields</FieldInputLabel>}
      {...rest}
      data={data}
    />
  )
}
