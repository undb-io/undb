import type { IUpdateTableSchema } from '@egodb/core'
import { useUpdateTableMutation } from '@egodb/store'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack, Text, TextInput } from '@egodb/ui'
import { useFormContext } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const UpdateTableForm: React.FC<IProps> = ({ onCancel, onSuccess: success }) => {
  const table = useCurrentTable()
  const form = useFormContext<IUpdateTableSchema>()

  const [updateTable, { reset: resetUpdateTable, isLoading, isError, error }] = useUpdateTableMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await updateTable({ id: table.id.value, ...values })
    reset()
    success?.()
  })

  const reset = () => {
    onCancel()
    resetUpdateTable()
    form.reset()
  }

  const disabled = !form.formState.isValid || !form.formState.isDirty

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          error={form.formState.errors['name']?.message}
          label={
            <Text size={14} fw={700} tt="uppercase" display="inline-block">
              name
            </Text>
          }
          {...form.register('name')}
          required={true}
        />

        <Divider />

        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button loading={isLoading} miw={200} disabled={disabled} type="submit">
            Update
          </Button>
        </Group>

        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}
      </Stack>
    </form>
  )
}
