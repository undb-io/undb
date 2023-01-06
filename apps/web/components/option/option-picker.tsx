import type { IOptionColorName, IOptionColorShade, SelectField } from '@egodb/core'
import type { Table } from '@egodb/core'
import { OptionId } from '@egodb/core'
import type { SelectProps } from '@egodb/ui'
import { Group } from '@egodb/ui'
import { Select } from '@egodb/ui'
import { forwardRef } from 'react'
import { trpc } from '../../trpc'
import { Option } from './option'

interface IProps extends Omit<SelectProps, 'data'> {
  field: SelectField
  table: Table
}

export const OptionPicker: React.FC<IProps> = ({ field, table, ...rest }) => {
  const nextColor = field.options.lastOption.map((o) => o.color.next()).unwrap()
  const utils = trpc.useContext()
  const createOption = trpc.table.field.select.createOption.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })

  return (
    <Select
      data={field.options.options.map((o) => ({
        value: o.id.value,
        label: o.name.value,
        colorName: o.color.name,
        shade: o.color.shade,
      }))}
      clearable
      itemComponent={SelectItem}
      searchable
      creatable
      onCreate={(query) => {
        const id = OptionId.create().value
        createOption.mutate({
          fieldId: field.id.value,
          tableId: table.id.value,
          option: {
            id,
            name: query,
            color: {
              name: nextColor.name,
              shade: nextColor.shade,
            },
          },
        })
        return id
      }}
      getCreateLabel={(query) => (
        <Group>
          {`+ Create `}
          <Option name={query} id={''} colorName={nextColor.name} shade={nextColor.shade} />
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
      <Option id={value} name={label} colorName={colorName} shade={shade} />
    </Group>
  ),
)
