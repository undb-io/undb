import { setCalendarFieldSchema } from '@egodb/core'
import { useSetCalendarFieldMutation } from '@egodb/store'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { FieldIcon } from '../field-inputs/field-Icon'
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

  const [setCalendarField, { isLoading }] = useSetCalendarFieldMutation()

  const form = useForm({
    defaultValues: {
      field: initialCalendarFieldId ?? '',
    },
    resolver: zodResolver(setCalendarFieldSchema),
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await setCalendarField({
      tableId: table.id.value,
      field: values.field,
    })

    onSuccess?.()
  })

  const setStepOne = useSetAtom(calendarStepOne)
  const setStepTwo = useSetAtom(calendarStepTwo)

  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow="md">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select calendar field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasCalendarFields ? (
              <Controller
                name="field"
                control={form.control}
                render={(f) => (
                  <Radio.Group
                    {...f.field}
                    orientation="vertical"
                    onChange={(value) => f.field.onChange(value)}
                    withAsterisk
                  >
                    {calendarFields.map((f) => (
                      <Radio
                        key={f.id.value}
                        value={f.id.value}
                        label={
                          <Group spacing="xs">
                            <FieldIcon type={f.type} />
                            {f.name.value}
                          </Group>
                        }
                      />
                    ))}
                  </Radio.Group>
                )}
              />
            ) : null}

            {hasCalendarFields && <Divider label="or" labelPosition="center" />}

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
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
