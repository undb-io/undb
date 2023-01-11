import type { IEditTableSchema } from '@egodb/core'
import { editTableSchema } from '@egodb/core'
import { Drawer } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import type { ITableBaseProps } from '../table/table-base-props'
import { editTableFormDrawerOpened } from './drawer-opened.atom'
import { EditTableForm } from './edit-table-form'

export const EditTableFormDrawer: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(editTableFormDrawerOpened)

  const defaultValues: IEditTableSchema = {
    name: table.name.value,
  }

  useDeepCompareEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues])

  const form = useForm<IEditTableSchema>({
    defaultValues,
    resolver: zodResolver(editTableSchema),
  })

  const reset = () => {
    setOpened(false)
    form.clearErrors()
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
        title="Edit Table"
        padding="xl"
        position="right"
        size={700}
      >
        <EditTableForm table={table} onCancel={() => setOpened(false)} />
      </Drawer>
    </FormProvider>
  )
}
