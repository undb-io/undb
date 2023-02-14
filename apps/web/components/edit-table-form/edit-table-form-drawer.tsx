import type { IEditTableSchema } from '@egodb/core'
import { editTableSchema } from '@egodb/core'
import { Drawer } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { editTableFormDrawerOpened } from './drawer-opened.atom'
import { EditTableForm } from './edit-table-form'
import { EditTableMenu } from './edit-table-menu'

export const EditTableFormDrawer: React.FC = () => {
  const table = useCurrentTable()

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
        withCloseButton={false}
        onClose={() => {
          if (form.formState.isDirty) {
            confirm()
          } else {
            reset()
          }
        }}
        title={<EditTableMenu />}
        padding="xl"
        position="right"
        styles={{
          title: {
            width: '100%',
          },
        }}
        size={700}
      >
        <EditTableForm onCancel={() => setOpened(false)} />
      </Drawer>
    </FormProvider>
  )
}
