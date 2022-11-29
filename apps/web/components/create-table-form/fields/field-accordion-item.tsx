import { Accordion, Group, Text, Select, TextInput } from '@egodb/ui'
import { useCreateTableFormContext } from '../create-table-form-context'

interface IProps {
  index: number
  isNew?: boolean
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
            label="Field Type"
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
            label="Field Name"
            variant="filled"
            required={true}
          />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
