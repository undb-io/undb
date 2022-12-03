import type { NonNullableGetTableOutput } from '@egodb/core'
import { createRecordCommandInput } from '@egodb/core'
import { Drawer, useEgoUITheme, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import { useConfirmModal } from '../../hooks'
import { CreateRecordForm } from './create-record-form'
import { CreateRecordFormProvider, useCreateRecord } from './create-record-form-context'
import { createRecordFormDrawerOpened } from './drawer-opened.atom'

interface IProps {
  table: NonNullableGetTableOutput
}

export const CreateRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createRecordFormDrawerOpened)
  const theme = useEgoUITheme()

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
      tableId: table.id,
      value: {},
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
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <CreateRecordForm onCancel={() => setOpened(false)} />
      </Drawer>
    </CreateRecordFormProvider>
  )
}
