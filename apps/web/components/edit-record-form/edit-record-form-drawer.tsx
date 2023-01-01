import type { Table as CoreTable } from '@egodb/core'
import { createRecordCommandInput } from '@egodb/core'
import { Drawer, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useConfirmModal } from '../../hooks'
import { CreateRecordFormProvider, useCreateRecord } from '../create-record-form/create-record-form-context'
import { editRecordFormDrawerOpened } from './drawer-opened.atom'
import { EditRecordForm } from './edit-record-form'

interface IProps {
  table: CoreTable
}

export const EditRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editRecordFormDrawerOpened)

  const reset = () => {
    setOpened(false)
    form.clearErrors()
    form.reset()
    form.resetTouched()
    form.resetDirty()
  }
  const confirm = useConfirmModal({ onConfirm: reset })
  const form = useCreateRecord({
    initialValues: {
      tableId: table.id.value,
      value: table.schema.fields.map((field) => ({
        name: field.name.value,
        value: null,
      })),
    },
    validate: zodResolver(createRecordCommandInput),
  })

  return (
    <CreateRecordFormProvider form={form}>
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
        title="New Record"
        padding="xl"
        position="right"
        size={700}
      >
        <EditRecordForm table={table} onCancel={reset} />
      </Drawer>
    </CreateRecordFormProvider>
  )
}
