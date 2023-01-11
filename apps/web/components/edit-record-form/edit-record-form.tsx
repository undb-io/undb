import type { IUpdateRecordValueSchema, Table } from '@egodb/core'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import type { FieldPath } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { trpc } from '../../trpc'
import { RecordInputFactory } from '../record/record-input.factory'
import { editRecordValuesAtom } from './edit-record-values.atom'
import type { IMutateRecordValueSchema } from '@egodb/core'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const EditRecordForm: React.FC<IProps> = ({ table, onSuccess, onCancel }) => {
  const form = useFormContext<IUpdateRecordValueSchema>()
  const utils = trpc.useContext()

  const record = useAtomValue(editRecordValuesAtom)

  const updateRecord = trpc.record.update.useMutation({
    onSuccess() {
      reset()
      utils.record.list.refetch()
      onSuccess?.()
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    const values: IMutateRecordValueSchema = []

    for (const [index, field] of data.value.entries()) {
      const isDirty = form.getFieldState(`value.${index}.value`).isDirty
      if (isDirty) {
        values.push(field)
      }
    }

    if (record && values.length) {
      updateRecord.mutate({
        tableId: table.id.value,
        id: data.id,
        value: values,
      })
    }
  })

  const reset = () => {
    onCancel()
    updateRecord.reset()
    form.reset()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack>
          {table.schema.fields.map((field, index) => {
            const name: FieldPath<IUpdateRecordValueSchema> = `value.${index}.value`
            return <RecordInputFactory name={name} table={table} key={field.id.value} field={field} />
          })}
        </Stack>
        <Divider my="lg" />

        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            Cancel
          </Button>

          <Button miw={200} type="submit" disabled={!form.formState.isValid || !form.formState.isDirty}>
            Confirm
          </Button>
        </Group>

        {updateRecord.isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {updateRecord.error.message}
          </Alert>
        )}
      </form>
      <DevTool control={form.control} />
    </>
  )
}
