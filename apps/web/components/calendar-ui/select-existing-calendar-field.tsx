import { setCalendarFieldSchema } from '@egodb/core'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
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
    defaultValues: {
      field: initialCalendarFieldId ?? '',
    },
    resolver: zodResolver(setCalendarFieldSchema),
  })

  const onSubmit = form.handleSubmit((values) => {
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
                {calendarFields.map((f) => (
                  <Radio
                    key={f.id.value}
                    value={f.id.value}
                    {...form.register('field')}
                    label={
                      <Group spacing="xs">
                        <FieldIcon type={f.type} />
                        {f.id.value}
                      </Group>
                    }
                  />
                ))}
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
            <Button size="xs" type="submit" disabled={!form.formState.isValid || !form.formState.isDirty}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
