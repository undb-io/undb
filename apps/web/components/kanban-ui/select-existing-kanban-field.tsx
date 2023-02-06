import { setKanbanFieldSchema } from '@egodb/core'
import { useSetKanbanFieldMutation } from '@egodb/store'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { FieldIcon } from '../field-inputs/field-Icon'
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

  const [setKanbanField, { isLoading }] = useSetKanbanFieldMutation()

  const form = useForm({
    defaultValues: {
      field: initialKanbanFieldId ?? '',
    },
    resolver: zodResolver(setKanbanFieldSchema),
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await setKanbanField({
      tableId: table.id.value,
      field: values.field,
    })
    onSuccess?.()
  })

  const setKanbanStepOne = useSetAtom(kanbanStepOneAtom)
  const setKanbanStepTwo = useSetAtom(kanbanStepTwoAtom)

  return (
    <>
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Card shadow="md">
          <Card.Section withBorder inheritPadding py="sm">
            <Text>select kanban field</Text>
          </Card.Section>

          <Card.Section withBorder inheritPadding py="sm">
            <Stack spacing="xs">
              {hasKanbanFields ? (
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
                      {kanbanFields.map((f) => (
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

              {hasKanbanFields && <Divider label="or" labelPosition="center" />}

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
              <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
                Done
              </Button>
            </Group>
          </Card.Section>
        </Card>
      </form>
    </>
  )
}
