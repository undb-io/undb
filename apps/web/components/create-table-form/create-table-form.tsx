import type { ICreateTableInput } from '@egodb/core'
import { useCreateTableMutation } from '@egodb/store'
import { Alert, Button, Divider, Group, IconAlertCircle, Text, Space, TextInput, Code } from '@egodb/ui'
import { useRouter } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { CreateTableAddFieldButton } from './create-table-add-field-button'
import { CreateTableFormSchema } from './create-table-form-schema'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateTableForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
  const form = useFormContext<ICreateTableInput>()
  const router = useRouter()

  const [createTable, { isLoading, isError, error, reset: resetCreateTable }] = useCreateTableMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    const data = await createTable(values)
    if ('data' in data) {
      reset()
      router.push(`t/${data.data.id}`)
      onSuccess?.()
    }
  })

  const reset = () => {
    onCancel()
    resetCreateTable()
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
        <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
          Create
        </Button>
      </Group>

      {isError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
          {(error as any).message}
        </Alert>
      )}
    </form>
  )
}
