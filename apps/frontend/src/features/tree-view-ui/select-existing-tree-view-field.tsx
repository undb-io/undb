import { setTreeViewFieldSchema } from '@egodb/core'
import { useSetTreeFieldMutation } from '@egodb/store'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { FieldIcon } from '../field-inputs/field-Icon'
import { treeStepOneAtom } from './tree-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const SelectExistingField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const treeFields = table.schema.treeFields
  const view = useCurrentView()
  const initialTreeViewFieldId = view.treeView.into()?.fieldId?.value
  const hasTreeViewFields = treeFields.length > 0

  const [setTreeViewField, { isLoading }] = useSetTreeFieldMutation()

  const form = useForm({
    defaultValues: {
      field: initialTreeViewFieldId ?? '',
    },
    resolver: zodResolver(setTreeViewFieldSchema),
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await setTreeViewField({
      tableId: table.id.value,
      viewId: view.id.value,
      field: values.field,
    })
    onSuccess?.()
  })

  const setStepOne = useSetAtom(treeStepOneAtom)
  const { t } = useTranslation()
  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow="md">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>{t('Select Tree Field')}</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasTreeViewFields ? (
              <Controller
                name="field"
                control={form.control}
                render={(f) => (
                  <Radio.Group {...f.field} withAsterisk>
                    <Stack>
                      {treeFields.map((f) => (
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

            {hasTreeViewFields && <Divider label={t('or', { ns: 'common' })} labelPosition="center" />}

            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setStepOne}>
              {t('Create New Tree Field')}
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
  )
}
