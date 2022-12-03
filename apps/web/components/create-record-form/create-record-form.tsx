import { Alert, Button, Group, IconAlertCircle } from '@egodb/ui'
import { trpc } from '../../trpc'
import { useCreateRecordFormContext } from './create-record-form-context'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateRecordForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
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

      {createRecord.isError && (
        <Alert icon={<IconAlertCircle size={16} />} title="Oops! Create Record Error!" mt="lg">
          {createRecord.error.message}
        </Alert>
      )}
    </form>
  )
}
