import type { ICreateFieldSchema } from '@egodb/core'
import { createFieldSchema } from '@egodb/core'
import { Modal, useEgoUITheme, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import useDeepCompareEffect from 'use-deep-compare-effect'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateFieldForm } from './create-field-form'
import { CreateFieldFormProvider, useCreateField } from './create-field-form-context'
import { createFielModelOpened } from './create-field-modal-opened.atom'

export const CreateFieldModal: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createFielModelOpened)
  const initialValues: ICreateFieldSchema = {
    type: 'string',
    id: 'id',
    name: '',
  }

  const form = useCreateField({
    initialValues,
    validate: zodResolver(createFieldSchema),
  })

  useDeepCompareEffect(() => {
    form.setValues(initialValues)
  }, [initialValues])

  const theme = useEgoUITheme()

  return (
    <CreateFieldFormProvider form={form}>
      <Modal
        exitTransitionDuration={100}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add Field"
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <CreateFieldForm table={table} />
      </Modal>
    </CreateFieldFormProvider>
  )
}
