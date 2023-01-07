import { setKanbanFieldSchema } from '@egodb/core'
import { useForm, zodResolver, Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import { FieldIcon } from '../fields/field-Icon'
import type { ITableBaseProps } from '../table/table-base-props'
import { kanbanStepOneAtom, kanbanStepTwoAtom } from './kanban-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const SelectExistingField: React.FC<IProps> = ({ table, onSuccess }) => {
  const kanbanFields = table.schema.kanbanFields
  const view = table.mustGetView()
  const initialKanbanFieldId = view.kanban.into()?.fieldId?.value
  const hasKanbanFields = kanbanFields.length > 0

  const utils = trpc.useContext()
  const setKanbanField = trpc.table.view.kanban.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      onSuccess?.()
    },
  })

  const form = useForm({
    initialValues: {
      field: initialKanbanFieldId ?? '',
    },
    validate: zodResolver(setKanbanFieldSchema),
  })

  const onSubmit = form.onSubmit((values) => {
    setKanbanField.mutate({
      tableId: table.id.value,
      field: values.field,
    })
  })

  const setKanbanStepOne = useSetAtom(kanbanStepOneAtom)
  const setKanbanStepTwo = useSetAtom(kanbanStepTwoAtom)

  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow="md">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select one field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasKanbanFields ? (
              <>
                <Radio.Group
                  orientation="vertical"
                  defaultValue={initialKanbanFieldId}
                  {...form.getInputProps('field')}
                >
                  {kanbanFields.map((f) => (
                    <Radio
                      key={f.id.value}
                      value={f.id.value}
                      label={
                        <Group spacing="xs">
                          <FieldIcon type={f.type} />
                          {f.id.value}
                        </Group>
                      }
                    />
                  ))}
                </Radio.Group>
                <Divider label="or" labelPosition="center" />
              </>
            ) : null}

            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setKanbanStepOne}>
              add new select field
            </Button>
            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setKanbanStepTwo}>
              add new date field
            </Button>
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button size="xs" type="submit" disabled={!form.isValid() || !form.isDirty()}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
