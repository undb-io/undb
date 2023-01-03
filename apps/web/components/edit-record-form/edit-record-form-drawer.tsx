import type { Table as CoreTable } from '@egodb/core'
import { updateRecordSchema } from '@egodb/core'
import type { IUpdateRecordValueSchema } from '@egodb/core'
import { mutateRecordValueSchema } from '@egodb/core'
import { Drawer, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useConfirmModal } from '../../hooks'
import { editRecordFormDrawerOpened } from './drawer-opened.atom'
import { EditRecordForm } from './edit-record-form'
import { UpdateRecordFormProvider, useUpdateRecord } from './edit-record-form-context'
import { editRecordValuesAtom } from './edit-record-values.atom'

interface IProps {
  table: CoreTable
}

export const EditRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editRecordFormDrawerOpened)
  const [record, setRecord] = useAtom(editRecordValuesAtom)

  const initialValues: IUpdateRecordValueSchema = {
    id: record?.id ?? '',
    value: table.schema.fields.map((field) => ({
      name: field.name.value,
      value: record?.values[field.name.value] ?? null,
    })),
  }

  useEffect(() => {
    form.setValues(initialValues)
  }, [record])

  const reset = () => {
    setOpened(false)
    setRecord(null)
    form.clearErrors()
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })
  const form = useUpdateRecord({
    initialValues,
    validate: zodResolver(updateRecordSchema),
  })

  return (
    <UpdateRecordFormProvider form={form}>
      <Drawer
        target="body"
        opened={opened}
        onClose={() => {
          if (form.isDirty()) {
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
    </UpdateRecordFormProvider>
  )
}
