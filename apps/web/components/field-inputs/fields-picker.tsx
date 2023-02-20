import type { IFieldType } from '@egodb/core'
import { useGetTableQuery } from '@egodb/store'
import type { MultiSelectProps, SelectItem as SelectItemType } from '@egodb/ui'
import { useListState } from '@egodb/ui'
import { ActionIcon, Group, Text } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef, useEffect } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
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

export const FieldsPicker: React.FC<IProps> = ({ tableId, ...props }) => {
  const ct = useCurrentTable()
  const tid = tableId ?? ct.id.value
  const { data: table, refetch } = useGetTableQuery({ id: tid })
  const [state, handlers] = useListState<string>()

  useEffect(() => {
    refetch()
    handlers.setState([])
  }, [tid])

  const data =
    table?.schema?.map((f, index) => ({
      value: f.id,
      label: f.name || `Field ` + (index + 1),
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
      data={data}
      itemComponent={SelectItem}
    />
  )
}
