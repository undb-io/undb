import { Alert, Button, Divider, Group, IconAlertCircle, Stack, Text, TextInput } from '@egodb/ui'
import { trpc } from '../../trpc'
import type { ITableBaseProps } from '../table/table-base-props'
import { useEditTableFormContext } from './edit-table-form-context'

interface IProps extends ITableBaseProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const EditTableForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  const form = useEditTableFormContext()
  const utils = trpc.useContext()

  const editTable = trpc.table.edit.useMutation({
    onSuccess: () => {
      reset()
      utils.table.list.refetch()
      utils.table.get.refetch()
      onSuccess?.()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    editTable.mutate({ id: table.id.value, ...values })
  })

  const reset = () => {
    onCancel()
    editTable.reset()
    form.reset()
  }

  const disabled = !form.isValid || !form.isDirty()

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          error={form.errors['name']}
          label={
            <Text size={14} fw={700} tt="uppercase" display="inline-block">
              name
            </Text>
          }
          {...form.getInputProps('name')}
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
