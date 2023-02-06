import { RecordFactory } from '@egodb/core'
import { updateRecordSchema } from '@egodb/core'
import type { IUpdateRecordValueSchema, Table as CoreTable } from '@egodb/core'
import { ActionIcon, Drawer, IconChevronLeft, IconChevronRight } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useLayoutEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector, useConfirmModal } from '../../hooks'
import { editRecordFormDrawerOpened } from './drawer-opened.atom'
import { EditRecordForm } from './edit-record-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getSelectedRecordId, resetSelectedRecordId, useGetRecordQuery } from '@egodb/store'

interface IProps {
  table: CoreTable
}

export const EditRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editRecordFormDrawerOpened)
  const dispatch = useAppDispatch()

  const selectedRecordId = useAppSelector(getSelectedRecordId)
  const { selectedRecord } = useGetRecordQuery(
    { id: selectedRecordId, tableId: table.id.value },
    {
      skip: !selectedRecordId,
      selectFromResult: (result) => ({
        ...result,
        selectedRecord: result.data ? RecordFactory.fromQuery(result.data, table.schema.toIdMap()).unwrap() : undefined,
      }),
    },
  )

  const defaultValues: IUpdateRecordValueSchema = useMemo(
    () => ({
      id: selectedRecord?.id.value ?? '',
      value: table.schema.nonSystemFields.map((field) => ({
        id: field.id.value,
        value: selectedRecord?.valuesJSON?.[field.id.value]?.unpack() ?? null,
      })),
    }),
    [selectedRecord],
  )

  const form = useForm<IUpdateRecordValueSchema>({
    defaultValues,
    resolver: zodResolver(updateRecordSchema),
  })

  useLayoutEffect(() => {
    form.reset(defaultValues)
  }, [selectedRecordId])

  const reset = () => {
    setOpened(false)
    dispatch(resetSelectedRecordId())
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

  return (
    <FormProvider {...form}>
      <Drawer
        target="body"
        opened={opened}
        withOverlay={false}
        withinPortal
        trapFocus
        onClose={() => {
          if (form.formState.isDirty) {
            confirm()
          } else {
            reset()
          }
        }}
        title="Edit Record"
        padding="xl"
        position="right"
        size="xl"
      >
        <EditRecordForm table={table} onCancel={reset} />
        <ActionIcon
          onClick={() => setOpened(false)}
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
            border: '1px solid ' + theme.colors.gray[1],
            ':hover': {
              boxShadow: theme.shadows.md,
            },
          })}
        >
          {opened ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
        </ActionIcon>
      </Drawer>
    </FormProvider>
  )
}
