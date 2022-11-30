import { useSortable } from '@dnd-kit/sortable'
import { Accordion, Group, Text, Select, TextInput, Space, ActionIcon, IconGripVertical } from '@egodb/ui'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useCreateTableFormContext } from '../create-table-form-context'
import { FieldCommonControl } from './field-common-control'

interface IProps {
  id: string
  index: number
  isNew?: boolean
}

type Props = {
  children?: React.ReactNode
}

const FieldInputLabel: React.FC<Props> = ({ children }) => {
  return (
    <Text size={12} fw={700} tt="uppercase" display="inline-block">
      {children}
    </Text>
  )
}

export const FieldAccordionItem: React.FC<IProps> = ({ index, id }) => {
  const form = useCreateTableFormContext()
  const name = form.values.schema[index].name

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Accordion.Item id={id} opacity={isDragging ? 0.5 : 1} value={id}>
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
        <Group grow={true}>
          <Select
            {...form.getInputProps(`schema.${index}.type`)}
            label={<FieldInputLabel>type</FieldInputLabel>}
            defaultValue="text"
            variant="filled"
            required={true}
            data={[
              { value: 'text', label: 'Text' },
              { value: 'number', label: 'Number' },
            ]}
          />
          <TextInput
            {...form.getInputProps(`schema.${index}.name`)}
            label={<FieldInputLabel>name</FieldInputLabel>}
            variant="filled"
            required={true}
          />
        </Group>
        <Space h="lg" />
        <FieldCommonControl index={index} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
