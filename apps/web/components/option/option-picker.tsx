import type { IOptionColorName, IOptionColorShade, SelectField } from '@egodb/core'
import type { SelectProps } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { forwardRef } from 'react'
import { Option } from './option'

interface IProps extends Omit<SelectProps, 'data'> {
  field: SelectField
}

export const OptionPicker: React.FC<IProps> = ({ field, ...rest }) => {
  return (
    <Select
      clearable
      data={field.options.options.map((o) => ({
        value: o.id.value,
        label: o.name.value,
        colorName: o.color.name,
        shade: o.color.shade,
      }))}
      itemComponent={SelectItem}
      {...rest}
    />
  )
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
  colorName: IOptionColorName
  shade: IOptionColorShade
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, label, colorName, shade, ...others }: ItemProps, ref) => (
    <Group ref={ref} p="xs" {...others}>
      <Option id={value} name={label} colorName={colorName} shade={shade} />
    </Group>
  ),
)
