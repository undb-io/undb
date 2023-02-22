import type { ICreateTreeFieldSchema } from '@egodb/core'
import { FieldId } from '@egodb/core'
import { createTreeFieldSchema } from '@egodb/core'
import { useCreateFieldMutation, useSetTreeFieldMutation } from '@egodb/store'
import { Button, Card, FocusTrap, Group, IconChevronLeft, Stack, Text, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { Controller, useForm } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { DisplayFieldsPicker } from '../field-inputs/display-fields-picker'
import { treeStepZeroAtom } from './tree-step.atom'

interface IProps {
  onSuccess?: () => void
}

export const CreateTreeField: React.FC<IProps> = ({ onSuccess }) => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const form = useForm<ICreateTreeFieldSchema>({
    defaultValues: {
      type: 'tree',
      name: '',
    },
    resolver: zodResolver(createTreeFieldSchema),
  })

  const [createTreeField, { isLoading }] = useCreateFieldMutation()
  const [setKanbanField] = useSetTreeFieldMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    values.id = FieldId.createId()
    await createTreeField({
      tableId: table.id.value,
      field: values,
    })
    await setKanbanField({
      tableId: table.id.value,
      viewId: view.id.value,
      field: values.id,
    })
    setStepZero()
    onSuccess?.()
  })

  const setStepZero = useSetAtom(treeStepZeroAtom)
  return (
    <form onSubmit={onSubmit}>
      <Card shadow="sm" withBorder radius={0} sx={{ overflow: 'visible' }}>
        <Card.Section withBorder inheritPadding py="sm">
          <Text>create new tree field</Text>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Stack spacing="xs">
            <FocusTrap>
              <TextInput {...form.register('name')} placeholder="new tree field name" />
            </FocusTrap>
            <Controller
              control={form.control}
              name={`parentFieldName`}
              render={(props) => (
                <TextInput
                  label={<FieldInputLabel>parent field name</FieldInputLabel>}
                  {...props.field}
                  value={props.field.value ?? ''}
                  placeholder="new tree field parent name"
                />
              )}
            />
            <Controller
              control={form.control}
              name="displayFieldIds"
              render={(props) => (
                <DisplayFieldsPicker
                  variant="default"
                  tableId={table.id.value}
                  dropdownPosition="bottom"
                  {...props.field}
                  onChange={(ids) => props.field.onChange(ids)}
                />
              )}
            />
          </Stack>
        </Card.Section>

        <Card.Section withBorder inheritPadding py="sm">
          <Group position="right">
            <Button leftIcon={<IconChevronLeft size={14} />} size="xs" variant="white" onClick={setStepZero}>
              Select Existing Field
            </Button>
            <Button size="xs" type="submit" disabled={!form.formState.isValid} loading={isLoading}>
              Done
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  )
}
