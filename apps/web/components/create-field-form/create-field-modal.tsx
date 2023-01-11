import type { ICreateFieldSchema } from '@egodb/core'
import { createFieldSchema } from '@egodb/core'
import { Modal } from '@egodb/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateFieldForm } from './create-field-form'
import { createFielModelOpened } from './create-field-modal-opened.atom'

export const CreateFieldModal: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createFielModelOpened)
  const defaultValues: ICreateFieldSchema = {
    type: 'string',
    id: '',
    name: '',
  }

  const form = useForm<ICreateFieldSchema>({
    defaultValues,
    resolver: zodResolver(createFieldSchema),
  })

  return (
    <FormProvider {...form}>
      <Modal exitTransitionDuration={100} opened={opened} onClose={() => setOpened(false)} title="Add Field">
        <CreateFieldForm table={table} />
      </Modal>
    </FormProvider>
  )
}
