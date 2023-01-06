import type { Table } from '@egodb/core'
import { Button, Divider, Group, Stack } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import { trpc } from '../../trpc'
import { RecordInputFactory } from '../record/record-input.factory'
import { useUpdateRecordFormContext } from './edit-record-form-context'
import { editRecordValuesAtom } from './edit-record-values.atom'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const EditRecordForm: React.FC<IProps> = ({ table, onSuccess, onCancel }) => {
  const form = useUpdateRecordFormContext()
  const utils = trpc.useContext()

  const record = useAtomValue(editRecordValuesAtom)

  const updateRecord = trpc.record.update.useMutation({
    onSuccess() {
      reset()
      utils.record.list.refetch()
      onSuccess?.()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    if (record) {
      updateRecord.mutate({
        tableId: table.id.value,
        ...values,
      })
    }
  })

  const reset = () => {
    onCancel()
    updateRecord.reset()
    form.reset()
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        {table.schema.fields.map((field, index) => {
          const props = form.getInputProps(`value.${index}.value`)
          return <RecordInputFactory table={table} key={field.id.value} props={props} field={field} />
        })}
      </Stack>
      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>

        <Button miw={200} type="submit" disabled={!form.isValid() || !form.isDirty()}>
          Confirm
        </Button>
      </Group>
    </form>
  )
}
