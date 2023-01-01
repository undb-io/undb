import { setKanbanFieldSchema } from '@egodb/core'
import { useForm, zodResolver, Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { stepOneAtom } from './kanban-step.atom'

export const SelectExistingField: React.FC<ITableBaseProps> = ({ table }) => {
  const selectFields = table.schema.selectFields
  const hasSelectFields = selectFields.length > 0

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

  const setStepOne = useSetAtom(stepOneAtom)

  return (
    <form onSubmit={onSubmit}>
      <Card shadow={'sm'} w={450}>
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select one field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasSelectFields ? (
              <>
                <Radio.Group {...form.getInputProps('field')}>
                  {selectFields.map((f) => (
                    <Radio key={f.id.value} value={f.id.value} label={f.name.value} />
                  ))}
                </Radio.Group>
                <Divider label="or" labelPosition="center" />
              </>
            ) : null}

            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setStepOne}>
              add new select field
            </Button>
          </Stack>
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
  )
}
