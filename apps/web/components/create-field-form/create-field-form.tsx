import { Button, Divider, Group, Select, Stack, TextInput } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { FIELD_SELECT_ITEMS } from '../../constants/field.constants'
import { trpc } from '../../trpc'
import { FieldInputLabel } from '../fields/field-input-label'
import { FieldIcon } from '../fields/field-Icon'
import type { ITableBaseProps } from '../table/table-base-props'
import { createFielModelOpened } from './create-field-modal-opened.atom'
import { CreateFieldVariantControl } from './create-field-variant-control'
import { FieldItem } from '../fields/field-item'
import { Controller, useFormContext } from 'react-hook-form'
import type { ICreateFieldSchema } from '@egodb/core'

interface IProps extends ITableBaseProps {
  onCancel?: () => void
  onSuccess?: () => void
}

export const CreateFieldForm: React.FC<IProps> = ({ table, onCancel }) => {
  const form = useFormContext<ICreateFieldSchema>()
  const setOpened = useSetAtom(createFielModelOpened)

  const utils = trpc.useContext()

  const createField = trpc.table.field.create.useMutation({
    onSuccess: () => {
      form.reset()
      setOpened(false)
      utils.table.get.refetch()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createField.mutate({ id: table.id.value, field: values })
  })

  const props = form.register('name')

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Controller
          name="type"
          render={(props) => (
            <Select
              {...props.field}
              onChange={(type) => type && props.field.onChange(type)}
              required
              label={<FieldInputLabel>type</FieldInputLabel>}
              data={FIELD_SELECT_ITEMS}
              itemComponent={FieldItem}
              icon={<FieldIcon type={form.watch('type')} />}
            />
          )}
        />
        <TextInput
          {...props}
          onChange={(e) => {
            props.onChange(e)
            form.setValue('id', e.target.value)
          }}
          label={<FieldInputLabel>name</FieldInputLabel>}
          required
        />
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

          <Button loading={createField.isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
