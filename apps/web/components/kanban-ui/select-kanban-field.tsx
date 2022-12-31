import { setKanbanFieldSchema } from '@egodb/core'
import { Button, Card, Center, Container, Group, Radio, Text, useForm, zodResolver } from '@egodb/ui'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'

export const SelectKanbanField: React.FC<ITableBaseProps> = ({ table }) => {
  const selectFields = table.schema.selectFields
  const utils = trpc.useContext()
  const setKanbanField = trpc.table.setKanbanField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })

  const form = useForm({
    initialValues: {
      field: '',
    },
    validate: zodResolver(setKanbanFieldSchema),
  })

  const onSubmit = form.onSubmit((values) => {
    setKanbanField.mutate({
      tableId: table.id.value,
      field: values.field,
    })
  })

  return (
    <Container h="100%">
      <Center h="100%">
        <form onSubmit={onSubmit}>
          <Card shadow="xs" radius="xs" w={500} withBorder>
            <Card.Section withBorder inheritPadding py="sm">
              <Text>select one field</Text>
            </Card.Section>

            <Card.Section withBorder inheritPadding py="sm">
              <Radio.Group {...form.getInputProps('field')}>
                {selectFields.map((f) => (
                  <Radio key={f.id.value} value={f.id.value} label={f.name.value} />
                ))}
              </Radio.Group>
            </Card.Section>

            <Card.Section withBorder inheritPadding py="sm">
              <Group position="right">
                <Button size="xs" type="submit" disabled={!form.isValid()}>
                  Done
                </Button>
              </Group>
            </Card.Section>
          </Card>
        </form>
      </Center>
    </Container>
  )
}
