import { useSortable } from '@dnd-kit/sortable'
import { Accordion, Group, Text, Select, TextInput, Space, ActionIcon, IconGripVertical, Stack } from '@egodb/ui'
import React from 'react'
import { CSS } from '@dnd-kit/utilities'
import { FieldCommonControl } from './field-common-control'
import { FieldInputLabel } from '../../field-inputs/field-input-label'
import { FIELD_SELECT_ITEMS } from '../../../constants/field.constants'
import { FieldVariantControl } from './field-variant-control'
import { FieldIcon } from '../../field-inputs/field-Icon'
import { FieldItem } from '../../field-inputs/field-item'
import { Controller, useFormContext } from 'react-hook-form'
import type { ICreateTableInput } from '@egodb/cqrs'

interface IProps {
  id: number
  index: number
  isNew?: boolean
}

export type Props = {
  children?: React.ReactNode
}

export const FieldAccordionItem: React.FC<IProps> = ({ index, id }) => {
  const form = useFormContext<ICreateTableInput>()
  const name = form.watch(`schema.${index}.name`)

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

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
            <Controller
              name={`schema.${index}.type`}
              render={(f) => (
                <Select
                  {...f.field}
                  onChange={(value) => f.field.onChange(value)}
                  label={<FieldInputLabel>type</FieldInputLabel>}
                  defaultValue="string"
                  variant="filled"
                  required={true}
                  data={FIELD_SELECT_ITEMS}
                  itemComponent={FieldItem}
                  icon={<FieldIcon type={form.watch(`schema.${index}.type`)} />}
                />
              )}
            />

            <TextInput
              {...form.register(`schema.${index}.name`)}
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
