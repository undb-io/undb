import type { IOptionColorName, IOptionColorShade, SelectField } from '@egodb/core'
import { OptionKey } from '@egodb/core'
import { useCreateOptionMutation } from '@egodb/store'
import type { SelectProps } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { forwardRef } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { Option } from './option'

interface IProps extends Omit<SelectProps, 'data'> {
  field: SelectField
}

export const OptionPicker: React.FC<IProps> = ({ field, ...rest }) => {
  const nextColor = field.options.lastOption.map((o) => o.color.next()).unwrap()
  const [createOption] = useCreateOptionMutation()

  const table = useCurrentTable()

  return (
    <Select
      data={field.options.options.map((o) => ({
        value: o.key.value,
        label: o.name.value,
        colorName: o.color.name,
        shade: o.color.shade,
      }))}
      clearable
      itemComponent={SelectItem}
      searchable
      creatable
      onCreate={(query) => {
        const key = OptionKey.create().value
        createOption({
          fieldId: field.id.value,
          tableId: table.id.value,
          option: {
            key,
            name: query,
            color: {
              name: nextColor.name,
              shade: nextColor.shade,
            },
          },
        })
        return key
      }}
      getCreateLabel={(query) => (
        <Group>
          {`+ Create `}
          <Option name={query} colorName={nextColor.name} shade={nextColor.shade} />
        </Group>
      )}
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
      <Option name={label} colorName={colorName} shade={shade} />
    </Group>
  ),
)
