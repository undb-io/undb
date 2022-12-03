import type { Table } from '@egodb/core'
import { Alert, Button, Group, IconAlertCircle, TextInput } from '@egodb/ui'
import { trpc } from '../../trpc'
import { FieldInputLabel } from '../fields/field-input-label'
import { useCreateRecordFormContext } from './create-record-form-context'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateRecordForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  const form = useCreateRecordFormContext()

  const createRecord = trpc.record.create.useMutation({
    onSuccess: () => {
      reset()
      onSuccess?.()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    createRecord.mutate(values)
  })

  const reset = () => {
    onCancel()
    createRecord.reset()
    form.reset()
    form.resetDirty()
    form.resetTouched()
  }

  return (
    <form onSubmit={onSubmit}>
      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button loading={createRecord.isLoading} miw={200} disabled={!form.isValid()} type="submit">
          Create
        </Button>
      </Group>

      {table.schema.fields.map((field, index) => {
        return (
          <TextInput
            {...form.getInputProps(`value.${index}.value`)}
            label={<FieldInputLabel>{field.name.value}</FieldInputLabel>}
          />
        )
      })}

      {createRecord.isError && (
        <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Record Error!" mt="lg">
          {createRecord.error.message}
        </Alert>
      )}
    </form>
  )
}
