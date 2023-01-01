import { setKanbanFieldSchema } from '@egodb/core'
import { useForm, zodResolver, Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { stepOneAtom } from './kanban-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const SelectExistingField: React.FC<IProps> = ({ table, onSuccess }) => {
  const selectFields = table.schema.selectFields
  const view = table.mustGetView()
  const initialSelectFieldId = view.kanban.into()?.fieldId?.value
  const hasSelectFields = selectFields.length > 0

  const utils = trpc.useContext()
  const setKanbanField = trpc.table.setKanbanField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      onSuccess?.()
    },
  })

  const form = useForm({
    initialValues: {
      field: initialSelectFieldId ?? '',
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
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow={'sm'}>
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select one field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasSelectFields ? (
              <>
                <Radio.Group
                  orientation="vertical"
                  defaultValue={initialSelectFieldId}
                  {...form.getInputProps('field')}
                >
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
            <Button size="xs" type="submit" disabled={!form.isValid() || !form.isDirty()}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
