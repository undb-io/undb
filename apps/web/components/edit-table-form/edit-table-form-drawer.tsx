import type { IEditTableSchema } from '@egodb/core'
import { editTableSchema } from '@egodb/core'
import { Drawer, useEgoUITheme, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import type { ITableBaseProps } from '../table/table-base-props'
import { editTableFormDrawerOpened } from './drawer-opened.atom'
import { EditTableForm } from './edit-table-form'
import { EditTableFormProvider, useEditTable } from './edit-table-form-context'

export const EditTableFormDrawer: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editTableFormDrawerOpened)
  const theme = useEgoUITheme()

  const initialValues: IEditTableSchema = {
    name: table.name.value,
  }

  useDeepCompareEffect(() => {
    form.setValues(initialValues)
  }, [initialValues])

  const form = useEditTable({
    initialValues,
    validate: zodResolver(editTableSchema),
    validateInputOnBlur: ['name'],
  })

  const reset = () => {
    setOpened(false)
    form.clearErrors()
    form.resetTouched()
    form.resetDirty()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

  return (
    <EditTableFormProvider form={form}>
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
        title="Edit Table"
        padding="xl"
        position="right"
        size={700}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <EditTableForm table={table} onCancel={() => setOpened(false)} />
      </Drawer>
    </EditTableFormProvider>
  )
}
