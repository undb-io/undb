import { updateRecordSchema } from '@egodb/core'
import type { IUpdateRecordValueSchema, IFieldQueryValue } from '@egodb/core'
import { ActionIcon, Drawer, IconChevronLeft, IconChevronRight, LoadingOverlay } from '@egodb/ui'
import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector, confirmModal } from '../../hooks'
import { UpdateRecordForm } from './update-record-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getHasSelectedRecordId, getSelectedRecordId, resetSelectedRecordId, useGetRecordQuery } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useTranslation } from 'react-i18next'
import { useOrderedFields } from '../../hooks/use-ordered-fields'

export const UpdateRecordFormDrawer: React.FC = () => {
  const table = useCurrentTable()
  const fields = useOrderedFields()

  const dispatch = useAppDispatch()

  const opened = useAppSelector(getHasSelectedRecordId)

  const selectedRecordId = useAppSelector(getSelectedRecordId)
  const { data, isLoading } = useGetRecordQuery(
    { id: selectedRecordId, tableId: table.id.value },
    { skip: !selectedRecordId },
  )

  const defaultValues = useMemo(
    () => ({
      id: data?.id ?? '',
      value: fields.map((field) => {
        let value: IFieldQueryValue | undefined

        if (field.type === 'id') {
          value = data?.id
        } else if (field.type === 'created-at') {
          value = data?.createdAt
        } else if (field.type === 'updated-at') {
          value = data?.updatedAt
        } else if (field.type === 'auto-increment') {
          value = data?.autoIncrement
        } else {
          value = data?.values?.[field.id.value] ?? null
        }
        return {
          id: field.id.value,
          value,
        }
      }),
    }),
    [data],
  )

  const form = useForm<IUpdateRecordValueSchema>({
    defaultValues,
    resolver: zodResolver(updateRecordSchema),
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [data, defaultValues, form])

  const reset = () => {
    dispatch(resetSelectedRecordId())
    form.reset()
  }
  const confirm = confirmModal({ onConfirm: reset })

  const { t } = useTranslation()

  return (
    <FormProvider {...form}>
      <Drawer.Root
        target="body"
        opened={opened}
        withinPortal
        trapFocus
        onClose={() => {
          if (form.formState.isDirty) {
            confirm()
          } else {
            reset()
          }
        }}
        padding="xl"
        position="right"
        size="xl"
      >
        <Drawer.Content sx={{ position: 'relative', overflow: 'visible' }}>
          <Drawer.Header sx={(theme) => ({ zIndex: 1000, borderBottom: '1px solid ' + theme.colors.gray[2] })}>
            {t('Update Record')}
          </Drawer.Header>
          <Drawer.Body pb="80px">
            <LoadingOverlay visible={isLoading} />
            <UpdateRecordForm onCancel={reset} />
          </Drawer.Body>
          <ActionIcon
            onClick={() => dispatch(resetSelectedRecordId())}
            variant="default"
            radius="xl"
            size="xl"
            sx={(theme) => ({
              position: 'fixed',
              top: 'calc(50% - 40px)',
              left: '-22px',
              backgroundColor: theme.white,
              boxShadow: theme.shadows.xl,
              transition: '0.4s',
              zIndex: 10000,
              border: '1px solid ' + theme.colors.gray[1],
              ':hover': {
                boxShadow: theme.shadows.md,
              },
            })}
          >
            {opened ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
          </ActionIcon>
        </Drawer.Content>
      </Drawer.Root>
    </FormProvider>
  )
}
