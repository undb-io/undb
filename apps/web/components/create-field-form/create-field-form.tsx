import { Button, closeModal, Divider, Group, Select, Stack, TextInput } from '@egodb/ui'
import { FIELD_SELECT_ITEMS } from '../../constants/field.constants'
import { trpc } from '../../trpc'
import { FieldInputLabel } from '../fields/field-input-label'
import { FieldIcon } from '../fields/field-Icon'
import { CreateFieldVariantControl } from './create-field-variant-control'
import { FieldItem } from '../fields/field-item'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import type { ICreateFieldSchema } from '@egodb/core'
import { createFieldSchema } from '@egodb/core'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ICreateFieldProps } from './create-field.props'
import { CREATE_FIELD_MODAL_ID } from '../../modals'

export const CreateFieldForm: React.FC<ICreateFieldProps> = ({ table, onCancel }) => {
  const defaultValues: ICreateFieldSchema = {
    type: 'string',
    id: '',
    name: '',
  }

  const form = useForm<ICreateFieldSchema>({
    defaultValues,
    resolver: zodResolver(createFieldSchema),
  })

  const utils = trpc.useContext()

  const createField = trpc.table.field.create.useMutation({
    onSuccess: () => {
      form.reset()
      closeModal(CREATE_FIELD_MODAL_ID)
      utils.table.get.refetch()
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    createField.mutate({ id: table.id.value, field: values })
  })

  const props = form.register('name')

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Stack>
          <Controller
            name="type"
            control={form.control}
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
                onCancel?.()
                closeModal(CREATE_FIELD_MODAL_ID)
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
    </FormProvider>
  )
}
