import { Alert, Button, Divider, Group, IconAlertCircle, TextInput } from '@egodb/ui'
import { trpc } from '../../trpc'
import { useCreateTableFormContext } from './create-table-form-context'

interface IProps {
  onCancel: () => void
}

export const CreateTableForm: React.FC<IProps> = ({ onCancel: onClose }) => {
  const form = useCreateTableFormContext()
  const utils = trpc.useContext()

  const createTable = trpc.table.create.useMutation({
    onSuccess: () => {
      reset()
      utils.table.list.refetch()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    createTable.mutate(values)
  })

  const reset = () => {
    onClose()
    createTable.reset()
    form.reset()
    form.resetDirty()
    form.resetTouched()
  }

  return (
    <form onSubmit={onSubmit}>
      <TextInput error={form.errors['name']} label="Name" {...form.getInputProps('name')} required={true} />
      <Divider my="lg" />
      <Group position="right">
        <Button color="dark" variant="subtle" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button loading={createTable.isLoading} miw={200} color="dark" disabled={!form.isValid()} type="submit">
          Create
        </Button>
      </Group>
      {createTable.isError && (
        <Alert icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg" color="red">
          {createTable.error.message}
        </Alert>
      )}
    </form>
  )
}
