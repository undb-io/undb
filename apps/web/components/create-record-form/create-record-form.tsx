import type { Table } from '@egodb/core'
import type { ICreateRecordInput } from '@egodb/core'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack } from '@egodb/ui'
import { useFormContext } from 'react-hook-form'
import { trpc } from '../../trpc'
import { RecordInputFactory } from '../record/record-input.factory'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateRecordForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  const form = useFormContext<ICreateRecordInput>()
  const utils = trpc.useContext()

  const createRecord = trpc.record.create.useMutation({
    onSuccess: () => {
      reset()
      form.reset()
      utils.record.list.refetch()
      onSuccess?.()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createRecord.mutate(values)
  })

  const reset = () => {
    onCancel()
    createRecord.reset()
    form.reset()
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        {table.schema.fields.map((field, index) => {
          const props = form.register(`value.${index}.value`)
          const value = form.getValues(`value.${index}.value`)
          return <RecordInputFactory value={value} table={table} key={field.id.value} props={props} field={field} />
        })}
      </Stack>

      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>

        <Button loading={createRecord.isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
          Create
        </Button>
      </Group>

      {createRecord.isError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Record Error!" mt="lg">
          {createRecord.error.message}
        </Alert>
      )}
    </form>
  )
}
