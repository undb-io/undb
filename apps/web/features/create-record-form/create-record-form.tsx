import type { ICreateRecordInput } from '@egodb/cqrs'
import { useCreateRecordMutation } from '@egodb/store'
import { Alert, Button, Divider, Group, IconAlertCircle, IconPlus, openContextModal, Space, Stack } from '@egodb/ui'
import { DevTool } from '@hookform/devtools'
import type { FieldPath } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_FIELD_MODAL_ID } from '../../modals'
import { RecordInputFactory } from '../record/record-input.factory'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateRecordForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
  const form = useFormContext<ICreateRecordInput>()
  const table = useCurrentTable()
  const view = useCurrentView()

  const [createRecord, { isLoading, isError, error, reset: resetCreateRecord }] = useCreateRecordMutation()

  const fields = view.getOrderedFields(table.schema.nonSystemFields)
  const onSubmit = form.handleSubmit(async (values) => {
    const result = await createRecord(values)
    if (!('error' in result)) {
      reset()
      form.reset()
      onSuccess?.()
    }
  })

  const reset = () => {
    onCancel()
    resetCreateRecord()
    form.reset()
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack>
          {fields.map((field, index) => {
            const name: FieldPath<ICreateRecordInput> = `value.${index}.value`
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

        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            Cancel
          </Button>

          <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
            Create
          </Button>
        </Group>

        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Record Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}
      </form>

      <DevTool control={form.control} />
    </>
  )
}
