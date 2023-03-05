import { RecordFactory } from '@egodb/core'
import { updateRecordSchema } from '@egodb/core'
import type { IUpdateRecordValueSchema, UnpackedFieldValue } from '@egodb/core'
import { ActionIcon, Drawer, IconChevronLeft, IconChevronRight } from '@egodb/ui'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector, useConfirmModal } from '../../hooks'
import { UpdateRecordForm } from './update-record-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getHasSelectedRecordId, getSelectedRecordId, resetSelectedRecordId, useGetRecordQuery } from '@egodb/store'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'

export const UpdateRecordFormDrawer: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()

  const dispatch = useAppDispatch()

  const schema = table.schema.toIdMap()
  const columnOrder = table.getFieldsOrder(view)
  const fields = columnOrder.map((fieldId) => schema.get(fieldId)).filter(Boolean)

  const opened = useAppSelector(getHasSelectedRecordId)

  const selectedRecordId = useAppSelector(getSelectedRecordId)
  const { selectedRecord, data } = useGetRecordQuery(
    { id: selectedRecordId, tableId: table.id.value },
    {
      skip: !selectedRecordId,
      selectFromResult: (result) => ({
        ...result,
        selectedRecord: result.data ? RecordFactory.fromQuery(result.data, table.schema.toIdMap()).unwrap() : undefined,
      }),
    },
  )

  const defaultValues = {
    id: selectedRecord?.id.value ?? '',
    value: fields.map((field) => {
      let value: UnpackedFieldValue | undefined

      if (field.type === 'id') {
        value = selectedRecord?.id.value
      } else if (field.type === 'created-at') {
        value = selectedRecord?.createdAt.unpack()
      } else if (field.type === 'updated-at') {
        value = selectedRecord?.updatedAt.unpack()
      } else if (field.type === 'auto-increment') {
        value = selectedRecord?.autoIncrement
      } else {
        value = selectedRecord?.valuesJSON?.[field.id.value]?.unpack() ?? null
      }
      return {
        id: field.id.value,
        value,
      }
    }),
  }

  const form = useForm<IUpdateRecordValueSchema>({
    defaultValues,
    resolver: zodResolver(updateRecordSchema),
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [data])

  const reset = () => {
    dispatch(resetSelectedRecordId())
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

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
          <Drawer.Header>Update Record</Drawer.Header>
          <Drawer.Body>
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
