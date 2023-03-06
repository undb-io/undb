import type { IUpdateRecordValueSchema } from '@egodb/core'
import {
  Alert,
  Box,
  Button,
  Divider,
  Group,
  IconAlertCircle,
  IconPlus,
  openContextModal,
  Space,
  Stack,
} from '@egodb/ui'
import type { FieldPath } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
// import { DevTool } from '@hookform/devtools'
import { RecordInputFactory } from '../record/record-input.factory'
import type { IMutateRecordValueSchema } from '@egodb/core'
import { getSelectedRecordId, useUpdateRecordMutation } from '@egodb/store'
import { useAppSelector } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_FIELD_MODAL_ID } from '../../modals'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const UpdateRecordForm: React.FC<IProps> = ({ onSuccess, onCancel }) => {
  const form = useFormContext<IUpdateRecordValueSchema>()
  const table = useCurrentTable()
  const view = useCurrentView()

  const schema = table.schema.toIdMap()
  const columnOrder = table.getFieldsOrder(view)
  const fields = columnOrder.map((fieldId) => schema.get(fieldId)).filter(Boolean)
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
      <form onSubmit={onSubmit} style={{ paddingBottom: '20px' }}>
        <Stack>
          {fields.map((field, index) => {
            const name: FieldPath<IUpdateRecordValueSchema> = `value.${index}.value`
            return <RecordInputFactory name={name} key={field.id.value} field={field} />
          })}
        </Stack>

        <Space h="lg" />

        <Button
          compact
          size="xs"
          color="gray"
          variant="white"
          leftIcon={<IconPlus size={14} />}
          tabIndex={-1}
          onClick={() => {
            openContextModal({
              title: 'Create New Field',
              modal: CREATE_FIELD_MODAL_ID,
              innerProps: {},
            })
          }}
        >
          Add New Field to Table
        </Button>

        <Divider my="lg" />

        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}

        <Box
          pos="fixed"
          bottom={0}
          right={0}
          w="100%"
          p="md"
          bg="white"
          sx={(theme) => ({ zIndex: 1000, borderTop: '1px solid ' + theme.colors.gray[2] })}
        >
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
        </Box>
      </form>
      {/* <DevTool control={form.control} /> */}
    </>
  )
}
