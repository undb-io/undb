import type { IUpdateOptionSchema } from '@egodb/core'
import type { IMutateOptionSchema } from '@egodb/core'
import type { SelectField } from '@egodb/core'
import { updateOptionSchema } from '@egodb/core'
import { OptionColor } from '@egodb/core'
import { Group, Button, closeModal, TextInput, FocusTrap } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { trpc } from '../../trpc'
import { OptionColorPicker } from '../fields/option-color-picker'
import { UDPATE_OPTION_MODAL_ID } from './update-option-modal'

interface IProps {
  tableId: string
  field: SelectField
  optionId: string
  option: IMutateOptionSchema
}

export const UpdateOptionForm: React.FC<IProps> = ({ tableId, field, optionId, option }) => {
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
      fieldId: field.id.value,
      id: optionId,
      option: values,
    })
  })

  return (
    <form onSubmit={onSubmit}>
      <>
        <Group>
          <Controller
            name="color"
            control={form.control}
            render={(props) => (
              <OptionColorPicker {...props.field} option={{ name: form.watch('name'), color: props.field.value }} />
            )}
          />
          <FocusTrap>
            <TextInput placeholder="option name..." variant="unstyled" {...form.register('name')} />
          </FocusTrap>
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
      </>
    </form>
  )
}
