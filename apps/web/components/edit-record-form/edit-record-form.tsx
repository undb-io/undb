import type { IUpdateRecordValueSchema, Table } from '@egodb/core'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack } from '@egodb/ui'
import type { FieldPath } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { RecordInputFactory } from '../record/record-input.factory'
import type { IMutateRecordValueSchema } from '@egodb/core'
import { getSelectedRecordId, useUpdateRecordMutation } from '@egodb/store'
import { useAppSelector } from '../../hooks'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const EditRecordForm: React.FC<IProps> = ({ table, onSuccess, onCancel }) => {
  const form = useFormContext<IUpdateRecordValueSchema>()

  const selectedRecordId = useAppSelector(getSelectedRecordId)

  const [updateRecord, { isLoading, isError, error, reset: resetUpdateRecord }] = useUpdateRecordMutation()

  const onSubmit = form.handleSubmit(async (data) => {
    const values: IMutateRecordValueSchema = []

    for (const [index, field] of data.value.entries()) {
      const isDirty = form.getFieldState(`value.${index}.value`).isDirty
      if (isDirty) {
        values.push(field)
      }
    }

    if (selectedRecordId && values.length) {
      await updateRecord({
        tableId: table.id.value,
        id: data.id,
        value: values,
      })
      reset()
      onSuccess?.()
    }
  })

  const reset = () => {
    onCancel()
    resetUpdateRecord()
    form.reset()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack>
          {table.schema.nonSystemFields.map((field, index) => {
            const name: FieldPath<IUpdateRecordValueSchema> = `value.${index}.value`
            return (
              <RecordInputFactory
                name={name}
                table={table}
                key={field.id.value}
                field={field}
                recordId={selectedRecordId}
              />
            )
          })}
        </Stack>
        <Divider my="lg" />

        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            Cancel
          </Button>

          <Button
            miw={200}
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty}
            loading={isLoading}
          >
            Confirm
          </Button>
        </Group>

        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}
      </form>
      <DevTool control={form.control} />
    </>
  )
}
