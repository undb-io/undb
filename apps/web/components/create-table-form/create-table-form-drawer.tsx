import type { ICreateTableInput } from '@egodb/core'
import { createTableCommandInput } from '@egodb/core'
import { Drawer, useEgoUITheme, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import { CreateTableForm } from './create-table-form'
import { CreateTableFormProvider, useCreateTable } from './create-table-form-context'
import { createTableFormDrawerOpened } from './drawer-opened.atom'

export const CreateTableFormDrawer: React.FC = () => {
  const [opened, setOpened] = useAtom(createTableFormDrawerOpened)
  const theme = useEgoUITheme()

  const initialValues: ICreateTableInput = {
    name: '',
    schema: [],
  }

  const form = useCreateTable({
    initialValues,
    validate: zodResolver(createTableCommandInput),
    validateInputOnBlur: ['name'],
  })

  useDeepCompareEffect(() => {
    form.setValues(initialValues)
  }, [initialValues])

  const reset = () => {
    setOpened(false)
    form.clearErrors()
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

  return (
    <CreateTableFormProvider form={form}>
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
        title="New Table"
        padding="xl"
        position="right"
        size={700}
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <CreateTableForm onCancel={() => setOpened(false)} />
      </Drawer>
    </CreateTableFormProvider>
  )
}
