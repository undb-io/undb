import { FieldId } from '@egodb/core'
import { Button, Divider, Group, Select, Stack, TextInput, Text } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { FIELD_SELECT_ITEMS } from '../../constants/field.constants'
import { trpc } from '../../trpc'
import { FieldInputLabel } from '../fields/field-input-label'
import { getSchemasIcon } from '../fields/field-Icon'
import type { ITableBaseProps } from '../table/table-base-props'
import { useCreateFieldFormContext } from './create-field-form-context'
import { createFielModelOpened } from './create-field-modal-opened.atom'
import { CreateFieldVariantControl } from './create-field-variant-control'
import { forwardRef } from 'react'

interface IProps extends ITableBaseProps {
  onCancel?: () => void
  onSuccess?: () => void
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
}

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ value, label, ...others }: ItemProps, ref) => {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        {getSchemasIcon({ type: value })}
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
})

export const CreateFieldForm: React.FC<IProps> = ({ table, onCancel }) => {
  const form = useCreateFieldFormContext()
  const setOpened = useSetAtom(createFielModelOpened)

  const utils = trpc.useContext()

  const createField = trpc.table.field.create.useMutation({
    onSuccess: () => {
      form.reset()
      setOpened(false)
      utils.table.get.refetch()
    },
  })

  const onSubmit = form.onSubmit((values) => {
    values.id = FieldId.create().value
    createField.mutate({ id: table.id.value, field: values })
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Select
          {...form.getInputProps('type')}
          required
          label={<FieldInputLabel>type</FieldInputLabel>}
          data={FIELD_SELECT_ITEMS}
          itemComponent={SelectItem}
          icon={getSchemasIcon({ type: form.values.type })}
        />
        <TextInput {...form.getInputProps('name')} label={<FieldInputLabel>name</FieldInputLabel>} required />
        <CreateFieldVariantControl />

        <Divider />

        <Group position="right">
          <Button
            variant="subtle"
            onClick={() => {
              setOpened(false)
              onCancel?.()
            }}
          >
            Cancel
          </Button>

          <Button loading={createField.isLoading} miw={200} disabled={!form.isValid()} type="submit">
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
