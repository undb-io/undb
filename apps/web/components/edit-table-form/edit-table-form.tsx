import type { IEditTableSchema } from '@egodb/core'
import { useEditTableMutation } from '@egodb/store'
import { Alert, Button, Divider, Group, IconAlertCircle, Stack, Text, TextInput } from '@egodb/ui'
import { useFormContext } from 'react-hook-form'
import type { ITableBaseProps } from '../table/table-base-props'

interface IProps extends ITableBaseProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const EditTableForm: React.FC<IProps> = ({ table, onCancel, onSuccess: success }) => {
  const form = useFormContext<IEditTableSchema>()

  const [editTable, { reset: resetEditTable, isLoading, isError, error }] = useEditTableMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await editTable({ id: table.id.value, ...values })
    reset()
    success?.()
  })

  const reset = () => {
    onCancel()
    resetEditTable()
    form.reset()
  }

  const disabled = !form.formState.isValid || !form.formState.isDirty

  return (
    <form onSubmit={onSubmit}>
      <Stack>
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

        <Divider />

        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button loading={isLoading} miw={200} disabled={disabled} type="submit">
            Update
          </Button>
        </Group>

        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}
      </Stack>
    </form>
  )
}
