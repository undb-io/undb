import { Modal } from '@egodb/ui'
import { useAtom } from 'jotai'
import type { ITableBaseProps } from '../table/table-base-props'
import { CreateFieldForm } from './create-field-form'
import { createFielModelOpened } from './create-field-modal-opened.atom'

export const CreateFieldModal: React.FC<ITableBaseProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createFielModelOpened)

  return (
    <Modal exitTransitionDuration={100} opened={opened} onClose={() => setOpened(false)} title="Add Field">
      <CreateFieldForm table={table} />
    </Modal>
  )
}
