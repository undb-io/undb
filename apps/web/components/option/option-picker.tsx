import type { SelectField } from '@egodb/core'
import type { SelectProps } from '@egodb/ui'
import { Select } from '@egodb/ui'

interface IProps extends Omit<SelectProps, 'data'> {
  field: SelectField
}

export const OptionPicker: React.FC<IProps> = ({ field, ...rest }) => {
  return (
    <Select clearable data={field.options.options.map((o) => ({ value: o.id.value, label: o.name.value }))} {...rest} />
  )
}
