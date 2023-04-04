import type { Field, IFieldType } from '@egodb/core'
import { TableFactory } from '@egodb/core'
import { useGetTableQuery } from '@egodb/store'
import type { MultiSelectProps, SelectItem as SelectItemType } from '@egodb/ui'
import { useListState } from '@egodb/ui'
import { ActionIcon, Group, Text } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef } from 'react'
import { FieldIcon } from './field-Icon'
import type { FieldBase } from './field-picker.type'
import { identity } from 'lodash-es'

export interface IForeignTablePickerProps extends Omit<MultiSelectProps, 'data'> {
  foreignTableId?: string
  fields?: FieldBase[]
  fieldFilter?: (f: Field) => boolean
  multiple?: boolean
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

export const ForeignFieldsPicker: React.FC<IForeignTablePickerProps> = ({
  foreignTableId,
  fields,
  fieldFilter,
  multiple = true,
  ...props
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data } = useGetTableQuery({ id: foreignTableId! }, { skip: !foreignTableId })
  const [state, handlers] = useListState<string>(props.value)

  const table = data ? TableFactory.fromQuery(data) : undefined

  const items =
    table?.schema?.fields.filter(fieldFilter ?? identity).map((f, index) => ({
      value: f.id.value,
      label: f.name.value || `Field ` + (index + 1),
      type: f.type,
    })) ??
    fields?.map((f) => ({ value: f.id, label: f.name, type: f.type })) ??
    ([] as SelectItemType[])

  return (
    <MultiSelect
      maxSelectedValues={multiple ? undefined : 1}
      variant="filled"
      multiple={multiple}
      {...props}
      value={state}
      onChange={(value) => {
        handlers.setState(value)
        props.onChange?.(value)
      }}
      data={items}
      itemComponent={SelectItem}
      withinPortal
    />
  )
}
