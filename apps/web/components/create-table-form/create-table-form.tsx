import { Alert, Button, Divider, Group, IconAlertCircle, Text, Space, TextInput } from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { trpc } from '../../trpc'
import { CreateTableAddFieldButton } from './create-table-add-field-button'
import { useCreateTableFormContext } from './create-table-form-context'
import { CreateTableFormSchema } from './create-table-form-schema'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateTableForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
  const form = useCreateTableFormContext()
  const utils = trpc.useContext()
  const router = useRouter()

  const createTable = trpc.table.create.useMutation({
    onSuccess: (data) => {
      reset()
      utils.table.list.refetch()
      router.push(`table/${data.id}`)
      onSuccess?.()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    createTable.mutate(values)
  })

  const reset = () => {
    onCancel()
    createTable.reset()
    form.reset()
    form.resetDirty()
    form.resetTouched()
  }

  return (
    <form onSubmit={onSubmit}>
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

      <Space h="md" />

      <CreateTableFormSchema />

      <Space h="md" />

      <CreateTableAddFieldButton />

      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button loading={createTable.isLoading} miw={200} disabled={!form.isValid()} type="submit">
          Create
        </Button>
      </Group>

      {createTable.isError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
          {createTable.error.message}
        </Alert>
      )}
    </form>
  )
}
