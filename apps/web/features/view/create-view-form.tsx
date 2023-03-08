import { createViewSchema, ViewId } from '@egodb/core'
import type { ICreateViewCommandInput } from '@egodb/cqrs'
import { useCreateViewMutation } from '@egodb/store'
import { Button, closeAllModals, Divider, Group, Stack, TextInput } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import { FieldInputLabel } from '../field-inputs/field-input-label'
import { DisplayTypePicker } from '../views/display-type-picker'
import { viewsOpenedAtom } from '../views/views-opened.atom'

export const CreateViewForm: React.FC = () => {
  const table = useCurrentTable()
  const router = useRouter()

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
    const id = ViewId.createId()
    await createView({
      tableId: table.id.value,
      view: { id, ...values },
    })

    closeAllModals()
    setOpened(false)
    router.push(`/t/${table.id.value}/${id}`)
  })
  const { t } = useTranslation()
  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <TextInput
          {...form.register('name')}
          label={<FieldInputLabel>{t('Name', { ns: 'common' })}</FieldInputLabel>}
          required
        />

        <Controller
          control={form.control}
          name="displayType"
          render={(f) => (
            <DisplayTypePicker label={<FieldInputLabel>{t('Type', { ns: 'common' })}</FieldInputLabel>} {...f.field} />
          )}
        />

        <Divider />

        <Group position="right">
          <Button
            variant="subtle"
            onClick={() => {
              closeAllModals()
            }}
          >
            {t('Cancel', { ns: 'common' })}
          </Button>

          <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
            {t('Create', { ns: 'common' })}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
