import { setCalendarFieldSchema } from '@egodb/core'
import { useForm, zodResolver, Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { trpc } from '../../trpc'
import { FieldIcon } from '../fields/field-Icon'
import type { ITableBaseProps } from '../table/table-base-props'
import { calendarStepOne, calendarStepTwo } from './calendar-step.atom'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const SelectExistingCalendarField: React.FC<IProps> = ({ table, onSuccess }) => {
  const calendarFields = table.schema.calendarFields
  const view = table.mustGetView()
  const initialCalendarFieldId = view.calendar.into()?.fieldId?.value
  const hasCalendarFields = calendarFields.length > 0

  const utils = trpc.useContext()
  const setCalendarField = trpc.table.view.calendar.setField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      onSuccess?.()
    },
  })

  const form = useForm({
    initialValues: {
      field: initialCalendarFieldId ?? '',
    },
    validate: zodResolver(setCalendarFieldSchema),
  })

  const onSubmit = form.onSubmit((values) => {
    setCalendarField.mutate({
      tableId: table.id.value,
      field: values.field,
    })
  })

  const setStepOne = useSetAtom(calendarStepOne)
  const setStepTwo = useSetAtom(calendarStepTwo)

  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow="md">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select one field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasCalendarFields ? (
              <>
                <Radio.Group
                  orientation="vertical"
                  defaultValue={initialCalendarFieldId}
                  {...form.getInputProps('field')}
                >
                  {calendarFields.map((f) => (
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

            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setStepOne}>
              add new date field
            </Button>
            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setStepTwo}>
              add new date range field
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
