import type { Table as CoreTable } from '@egodb/core'
import { updateRecordSchema } from '@egodb/core'
import type { IUpdateRecordValueSchema } from '@egodb/core'
import { Drawer } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useLayoutEffect } from 'react'
import { useConfirmModal } from '../../hooks'
import { editRecordFormDrawerOpened } from './drawer-opened.atom'
import { EditRecordForm } from './edit-record-form'
import { editRecordValuesAtom } from './edit-record-values.atom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface IProps {
  table: CoreTable
}

export const EditRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editRecordFormDrawerOpened)
  const [record, setRecord] = useAtom(editRecordValuesAtom)

  const defaultValues: IUpdateRecordValueSchema = {
    id: record?.id ?? '',
    value: table.schema.fields.map((field) => ({
      id: field.key.value,
      value: record?.values[field.key.value]?.unpack() ?? null,
    })),
  }

  const form = useForm<IUpdateRecordValueSchema>({
    defaultValues,
    resolver: zodResolver(updateRecordSchema),
  })

  useLayoutEffect(() => {
    form.reset(defaultValues)
  }, [record])

  const reset = () => {
    setOpened(false)
    setRecord(null)
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

  return (
    <FormProvider {...form}>
      <Drawer
        target="body"
        opened={opened}
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
        size={700}
      >
        <EditRecordForm table={table} onCancel={reset} />
      </Drawer>
    </FormProvider>
  )
}
