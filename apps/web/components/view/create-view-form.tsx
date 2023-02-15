import { createViewSchema } from '@egodb/core'
import type { ICreateViewCommandInput } from '@egodb/cqrs'
import { useCreateViewMutation } from '@egodb/store'
import { Button, closeAllModals, Divider, Group, Stack, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { useCurrentTable } from '../../hooks/use-current-table'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { viewsOpenedAtom } from '../views/views-opened.atom'

export const CreateViewForm: React.FC = () => {
  const table = useCurrentTable()

  const setOpened = useSetAtom(viewsOpenedAtom)

  const defaultValues: ICreateViewCommandInput['view'] = {
    name: '',
    displayType: 'grid',
  }

  const form = useForm<ICreateViewCommandInput['view']>({
    defaultValues,
    resolver: zodResolver(createViewSchema),
  })

  const [createView, { isLoading }] = useCreateViewMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await createView({
      tableId: table.id.value,
      view: values,
    })

    closeAllModals()
    setOpened(false)
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput {...form.register('name')} label={<FieldInputLabel>name</FieldInputLabel>} required />

        <Divider />

        <Group position="right">
          <Button
            variant="subtle"
            onClick={() => {
              closeAllModals()
            }}
          >
            Cancel
          </Button>

          <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
            Create
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
