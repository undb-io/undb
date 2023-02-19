import type { IFieldType } from '@egodb/core'
import type { MultiSelectProps } from '@egodb/ui'
import { ActionIcon, Group, Text } from '@egodb/ui'
import { MultiSelect } from '@egodb/ui'
import { forwardRef } from 'react'
import { FieldIcon } from './field-Icon'
import { FieldInputLabel } from './field-input-label'
import type { FieldBase } from './field-picker.type'

interface IProps extends Omit<MultiSelectProps, 'data'> {
  fields: FieldBase[]
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

export const FieldsPicker: React.FC<IProps> = ({ fields, ...rest }) => {
  const data = fields.map((f, index) => ({ value: f.id, label: f.name || `Field ` + (index + 1), type: f.type }))

  return (
    <MultiSelect
      placeholder="select display fields"
      variant="filled"
      label={<FieldInputLabel>Display Fields</FieldInputLabel>}
      {...rest}
      data={data}
      itemComponent={SelectItem}
    />
  )
}
