import type { ICreateRecordInput } from '@egodb/cqrs'
import { createCreateRecordCommandInput } from '@egodb/cqrs'
import { Drawer } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { confirmModal } from '../../hooks'
import { useCurrentTable } from '../../hooks/use-current-table'
import { CreateRecordForm } from './create-record-form'
import { createRecordInitialValueAtom } from './create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from './drawer-opened.atom'

export const CreateRecordFormDrawer: React.FC = () => {
  const table = useCurrentTable()
  const [opened, setOpened] = useAtom(createRecordFormDrawerOpened)
  const initialCreateRecordValue = useAtomValue(createRecordInitialValueAtom)

  const defaultValues = useMemo(
    () => ({
      tableId: table.id.value,
      values: table.schema.nonSystemFields.reduce(
        (curr, prev) => ({
          ...curr,
          [prev.id.value]: initialCreateRecordValue[prev.id.value] ?? (prev.type === 'bool' ? false : null),
        }),
        {},
      ),
    }),
    [initialCreateRecordValue],
  )

  const schema = createCreateRecordCommandInput(table.schema)
  const form = useForm<ICreateRecordInput>({
    defaultValues,
    resolver: zodResolver(schema),
  })

  useDeepCompareEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues])

  const reset = () => {
    setOpened(false)
    form.clearErrors()
  }
  const confirm = confirmModal({ onConfirm: reset })

  const { t } = useTranslation()

  return (
    <FormProvider {...form}>
      <Drawer
        target="body"
        opened={opened}
        withinPortal
        withCloseButton={false}
        onClose={() => {
          if (form.formState.isDirty) {
            confirm()
          } else {
            reset()
          }
        }}
        title={t('Create New Record')}
        padding="xl"
        position="right"
        size={700}
        overlayProps={{ sx: { zIndex: 198 } }}
        styles={{
          inner: {
            zIndex: 199,
          },
        }}
      >
        <CreateRecordForm onCancel={reset} />
      </Drawer>
    </FormProvider>
  )
}
