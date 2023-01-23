import type { ICreateTableInput } from '@egodb/core'
import { Alert, Button, Divider, Group, IconAlertCircle, Text, Space, TextInput, Code } from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { trpc } from '../../trpc'
import { CreateTableAddFieldButton } from './create-table-add-field-button'
import { CreateTableFormSchema } from './create-table-form-schema'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateTableForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
  const form = useFormContext<ICreateTableInput>()
  const utils = trpc.useContext()
  const router = useRouter()

  const createTable = trpc.table.create.useMutation({
    onSuccess: (data) => {
      reset()
      utils.table.list.refetch()
      router.push(`t/${data.id}`)
      onSuccess?.()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createTable.mutate(values)
  })

  const reset = () => {
    onCancel()
    createTable.reset()
    form.reset()
  }

  return (
    <form onSubmit={onSubmit}>
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

      <Space h="xs" />

      <Text size="xs" color="gray">
        System fields: <Code fw={600}>id</Code> , <Code fw={600}>createdAt</Code> , <Code fw={600}>updatedAt</Code> .
      </Text>

      <Space h="xs" />

      <CreateTableFormSchema />

      <Space h="md" />

      <CreateTableAddFieldButton />

      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button loading={createTable.isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
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
