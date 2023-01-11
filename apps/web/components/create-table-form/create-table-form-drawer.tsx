import type { ICreateTableInput } from '@egodb/core'
import { createTableCommandInput } from '@egodb/core'
import { Drawer } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import { CreateTableForm } from './create-table-form'
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

  useDeepCompareEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues])

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
        title="New Table"
        padding="xl"
        position="right"
        size={700}
      >
        <CreateTableForm onCancel={() => setOpened(false)} />
      </Drawer>
    </FormProvider>
  )
}
