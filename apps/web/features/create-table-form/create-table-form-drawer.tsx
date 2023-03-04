import type { ICreateTableInput } from '@egodb/cqrs'
import { createTableCommandInput } from '@egodb/cqrs'
import { Drawer } from '@egodb/ui'
// import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { FormProvider, useForm } from 'react-hook-form'
import { useConfirmModal } from '../../hooks'
import { CreateTableForm } from './create-table-form'
import { activeFieldAtom } from './create-table-form-schema.atom'
import { createTableFormDrawerOpened } from './drawer-opened.atom'

export const CreateTableFormDrawer: React.FC = () => {
  const [opened, setOpened] = useAtom(createTableFormDrawerOpened)

  const defaultValues: ICreateTableInput = {
    name: '',
    schema: [],
  }

  const form = useForm<ICreateTableInput>({
    defaultValues,
    resolver: zodResolver(createTableCommandInput),
  })
  const resetActiveField = useResetAtom(activeFieldAtom)

  const reset = () => {
    resetActiveField()
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
        title="New Table"
        padding="xl"
        position="right"
        size={700}
        styles={{
          header: { zIndex: 1000 },
          body: {
            paddingBottom: '80px',
          },
        }}
      >
        <CreateTableForm onCancel={reset} />
        {/* <DevTool control={form.control} /> */}
      </Drawer>
    </FormProvider>
  )
}
