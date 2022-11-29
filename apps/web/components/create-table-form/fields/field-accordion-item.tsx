import { Accordion, Group, Text, Select, TextInput, Space } from '@egodb/ui'
import React from 'react'
import { useCreateTableFormContext } from '../create-table-form-context'
import { FieldCommonControl } from './field-common-control'

interface IProps {
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

export const FieldAccordionItem: React.FC<IProps> = ({ index }) => {
  const form = useCreateTableFormContext()
  const name = form.values.schema[index].name

  return (
    <Accordion.Item value={String(index)}>
      <Accordion.Control>
        <Text fz="sm" fw={500}>
          {name || `Field ${index}`}
        </Text>
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
