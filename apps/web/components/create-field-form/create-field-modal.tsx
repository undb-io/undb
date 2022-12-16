import type { ICreateFieldSchema } from '@egodb/core'
import { Modal } from '@egodb/ui'
import { useAtom } from 'jotai'
import useDeepCompareEffect from 'use-deep-compare-effect'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateFieldForm } from './create-field-form'
import { CreateFieldFormProvider, useCreateField } from './create-field-form-context'
import { createFielModelOpened } from './create-field-modal-opened.atom'

export const CreateFieldModal: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createFielModelOpened)
  const initialValues: ICreateFieldSchema = {
    type: 'text',
    id: '',
    name: '',
  }

  const form = useCreateField({
    initialValues,
  })

  useDeepCompareEffect(() => {
    form.setValues(initialValues)
  }, [initialValues])

  return (
    <CreateFieldFormProvider form={form}>
      <Modal exitTransitionDuration={100} opened={opened} onClose={() => setOpened(false)} title="Add Field">
        <CreateFieldForm table={table} />
      </Modal>
    </CreateFieldFormProvider>
  )
}
