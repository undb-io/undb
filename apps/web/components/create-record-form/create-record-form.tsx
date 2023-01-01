import type { Table } from '@egodb/core'
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Group,
  IconAlertCircle,
  NumberInput,
  Stack,
  TextInput,
} from '@egodb/ui'
import { trpc } from '../../trpc'
import { FieldInputLabel } from '../fields/field-input-label'
import { OptionPicker } from '../option/option-picker'
import { useCreateRecordFormContext } from './create-record-form-context'

interface IProps {
  table: Table
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateRecordForm: React.FC<IProps> = ({ table, onCancel, onSuccess }) => {
  const form = useCreateRecordFormContext()
  const utils = trpc.useContext()

  const createRecord = trpc.record.create.useMutation({
    onSuccess: () => {
      reset()
      utils.record.list.refetch()
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
      <Stack>
        {table.schema.fields.map((field, index) => {
          const props = form.getInputProps(`value.${index}.value`)
          const label = <FieldInputLabel>{field.name.value}</FieldInputLabel>
          if (field.type === 'number') {
            return <NumberInput key={field.id.value} {...props} label={label} />
          }
          if (field.type === 'date') {
            return <DatePicker key={field.id.value} {...props} label={label} />
          }
          if (field.type === 'bool') {
            return <Checkbox key={field.id.value} {...props} label={label} />
          }
          if (field.type === 'select') {
            return <OptionPicker field={field} key={field.id.value} {...props} label={label} />
          }
          return <TextInput key={field.id.value} {...props} label={label} />
        })}
      </Stack>

      <Divider my="lg" />

      <Group position="right">
        <Button variant="subtle" onClick={() => onCancel()}>
          Cancel
        </Button>

        <Button loading={createRecord.isLoading} miw={200} disabled={!form.isValid()} type="submit">
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
