import type { IFieldType } from '@egodb/core'
import { TableFactory } from '@egodb/core'
import { useGetTableQuery } from '@egodb/store'
import type { MultiSelectProps, SelectItem as SelectItemType } from '@egodb/ui'
import { useListState } from '@egodb/ui'
import { ActionIcon, Group, Text } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef, useEffect } from 'react'
import { FieldIcon } from './field-Icon'
import { FieldInputLabel } from './field-input-label'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  tableId?: string
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
  type: IFieldType
}
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, type, ...others }: ItemProps, ref) => (
  <Group ref={ref} p="xs" {...others}>
    <ActionIcon size="sm">
      <FieldIcon type={type} />
    </ActionIcon>
    <Text>{label}</Text>
  </Group>
))

export const DisplayFieldsPicker: React.FC<IProps> = ({ tableId, ...props }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data, refetch } = useGetTableQuery({ id: tableId! }, { skip: !tableId })
  const [state, handlers] = useListState<string>(props.value)

  const table = data ? TableFactory.fromQuery(data) : undefined

  useEffect(() => {
    if (tableId) {
      refetch()
    }
    handlers.setState(props.value ?? [])
  }, [tableId])

  const items =
    table?.schema?.fields
      .filter((f) => f.isPrimitive())
      .map((f, index) => ({
        value: f.id.value,
        label: f.name.value || `Field ` + (index + 1),
        type: f.type,
      })) ?? ([] as SelectItemType[])

  return (
    <MultiSelect
      placeholder="select display fields"
      variant="filled"
      label={<FieldInputLabel>Display Fields</FieldInputLabel>}
      {...props}
      value={state}
      onChange={(value) => {
        handlers.setState(value)
        props.onChange?.(value)
      }}
      data={items}
      itemComponent={SelectItem}
    />
  )
}
