import { setKanbanFieldSchema } from '@undb/core'
import { useSetKanbanFieldMutation } from '@undb/store'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@undb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { FieldIcon } from '../field-inputs/field-Icon'
import { kanbanStepOneAtom, kanbanStepTwoAtom } from './kanban-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const SelectExistingField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const kanbanFields = table.schema.kanbanFields
  const view = useCurrentView()
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
      viewId: view.id.value,
      field: values.field,
    })
    onSuccess?.()
  })

  const setKanbanStepOne = useSetAtom(kanbanStepOneAtom)
  const setKanbanStepTwo = useSetAtom(kanbanStepTwoAtom)
  const { t } = useTranslation()
  return (
    <>
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Card shadow="md" withBorder sx={{ overflow: 'visible' }}>
          <Card.Section withBorder inheritPadding py="sm">
            <Text>{t('Select Kanban Field')}</Text>
          </Card.Section>

          <Card.Section withBorder inheritPadding py="sm">
            <Stack spacing="xs">
              {hasKanbanFields ? (
                <Controller
                  name="field"
                  control={form.control}
                  render={(f) => (
                    <Radio.Group {...f.field} onChange={(value) => f.field.onChange(value)} withAsterisk>
                      <Stack>
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
                      </Stack>
                    </Radio.Group>
                  )}
                />
              ) : null}

              {hasKanbanFields && <Divider label={t('or', { ns: 'common' })} labelPosition="center" />}

              <Button
                size="xs"
                variant="subtle"
                leftIcon={<IconPlus size={14} />}
                onClick={setKanbanStepOne}
                rightIcon={<FieldIcon type="select" />}
              >
                {t('Create New Select Field')}
              </Button>
              <Button
                size="xs"
                variant="subtle"
                leftIcon={<IconPlus size={14} />}
                onClick={setKanbanStepTwo}
                rightIcon={<FieldIcon type="date" />}
              >
                {t('Create New Date Field')}
              </Button>
            </Stack>
          </Card.Section>

          <Card.Section withBorder inheritPadding py="sm">
            <Group position="right">
              <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
                {t('Done', { ns: 'common' })}
              </Button>
            </Group>
          </Card.Section>
        </Card>
      </form>
    </>
  )
}
