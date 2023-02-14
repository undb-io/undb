import { setTreeViewFieldSchema } from '@egodb/core'
import { useSetTreeFieldMutation } from '@egodb/store'
import { Card, Radio, Group, Button, Text, IconPlus, Stack, Divider } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
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
  const initialTreeViewFieldId = view.calendar.into()?.fieldId?.value
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
      field: values.field,
    })
    onSuccess?.()
  })

  const setStepOne = useSetAtom(treeStepOneAtom)

  return (
    <form onSubmit={onSubmit} style={{ width: '100%' }}>
      <Card shadow="md">
        <Card.Section withBorder inheritPadding py="sm">
          <Text>select tree field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            {hasTreeViewFields ? (
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
                  </Radio.Group>
                )}
              />
            ) : null}

            {hasTreeViewFields && <Divider label="or" labelPosition="center" />}

            <Button size="xs" variant="subtle" leftIcon={<IconPlus size={14} />} onClick={setStepOne}>
              add new tree field
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
