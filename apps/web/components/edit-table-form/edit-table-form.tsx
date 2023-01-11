import type { IEditTableSchema } from '@egodb/core'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack, Text, TextInput } from '@egodb/ui'
import { useFormContext } from 'react-hook-form'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'

interface IProps extends ITableBaseProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const EditTableForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  const form = useFormContext<IEditTableSchema>()
  const utils = trpc.useContext()

  const editTable = trpc.table.edit.useMutation({
    onSuccess: () => {
      reset()
      utils.table.list.refetch()
      utils.table.get.refetch()
      onSuccess?.()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    editTable.mutate({ id: table.id.value, ...values })
  })

  const reset = () => {
    onCancel()
    editTable.reset()
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
          <Button loading={editTable.isLoading} miw={200} disabled={disabled} type="submit">
            Update
          </Button>
        </Group>

        {editTable.isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {editTable.error.message}
          </Alert>
        )}
      </Stack>
    </form>
  )
}
