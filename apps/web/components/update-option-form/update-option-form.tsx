import type { IUpdateOptionSchema } from '@egodb/core'
import type { IMutateOptionSchema } from '@egodb/core'
import type { SelectField } from '@egodb/core'
import { updateOptionSchema } from '@egodb/core'
import { OptionColor } from '@egodb/core'
import { Group, Button, closeModal, TextInput, FocusTrap, Divider, Stack } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { UDPATE_OPTION_MODAL_ID } from '../../modals'
import { trpc } from '../../trpc'
import { OptionColorPicker } from '../fields/option-color-picker'

interface IProps {
  tableId: string
  field: SelectField
  optionKey: string
  option: IMutateOptionSchema
}

export const UpdateOptionForm: React.FC<IProps> = ({ tableId, field, optionKey, option }) => {
  const form = useForm<IUpdateOptionSchema>({
    defaultValues: {
      name: option.name,
      color: option.color ?? OptionColor.defaultColor,
    },
    resolver: zodResolver(updateOptionSchema),
  })

  const utils = trpc.useContext()

  const updateOption = trpc.table.field.select.updateOption.useMutation({
    onSuccess() {
      utils.table.get.refetch()
      form.reset()
      closeModal(UDPATE_OPTION_MODAL_ID)
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    updateOption.mutate({
      tableId,
      fieldKey: field.key.value,
      id: optionKey,
      option: values,
    })
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group>
          <Controller
            name="color"
            control={form.control}
            render={(props) => (
              <OptionColorPicker {...props.field} option={{ name: form.watch('name'), color: props.field.value }} />
            )}
          />
          <TextInput data-autofocus placeholder="option name..." variant="unstyled" {...form.register('name')} />
        </Group>

        <Group position="right">
          <Button size="xs" variant="white" onClick={() => closeModal(UDPATE_OPTION_MODAL_ID)}>
            Cancel
          </Button>
          <Button
            size="xs"
            type="submit"
            disabled={!form.formState.isValid || !form.formState.isDirty}
            loading={updateOption.isLoading}
          >
            Done
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
