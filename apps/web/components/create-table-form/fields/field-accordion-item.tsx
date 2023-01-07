import { useSortable } from '@dnd-kit/sortable'
import { Accordion, Group, Text, Select, TextInput, Space, ActionIcon, IconGripVertical, Stack } from '@egodb/ui'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useCreateTableFormContext } from '../create-table-form-context'
import { FieldCommonControl } from './field-common-control'
import { FieldInputLabel } from '../../fields/field-input-label'
import { FIELD_SELECT_ITEMS } from '../../../constants/field.constants'
import { FieldVariantControl } from './field-variant-control'
import { FieldIcon } from '../../fields/field-Icon'
import { FieldItem } from '../../fields/field-item'

interface IProps {
  id: number
  index: number
  isNew?: boolean
}

export type Props = {
  children?: React.ReactNode
}

export const FieldAccordionItem: React.FC<IProps> = ({ index, id }) => {
  const form = useCreateTableFormContext()
  const name = form.values.schema[index].name

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const nameProps = form.getInputProps(`schema.${index}.name`)

  return (
    <Accordion.Item id={String(id)} opacity={isDragging ? 0.5 : 1} value={String(id)}>
      <Accordion.Control ref={setNodeRef} style={style}>
        <Group>
          <ActionIcon {...attributes} {...listeners} component="a">
            <IconGripVertical size={12} />
          </ActionIcon>
          <Text fz="sm" fw={500}>
            {name || `Field ${index + 1}`}
          </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Group grow={true}>
            <Select
              {...form.getInputProps(`schema.${index}.type`)}
              label={<FieldInputLabel>type</FieldInputLabel>}
              defaultValue="string"
              variant="filled"
              required={true}
              data={FIELD_SELECT_ITEMS}
              itemComponent={FieldItem}
              icon={<FieldIcon type={form.values.schema[index].type} />}
            />
            <TextInput
              {...nameProps}
              onChange={(e) => {
                nameProps.onChange(e)
                form.setFieldValue(`schema.${index}.id`, e.target.value)
              }}
              label={<FieldInputLabel>name</FieldInputLabel>}
              variant="filled"
              required={true}
              autoFocus
            />
          </Group>
          <FieldVariantControl index={index} />
        </Stack>
        <Space h="lg" />
        <FieldCommonControl index={index} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
