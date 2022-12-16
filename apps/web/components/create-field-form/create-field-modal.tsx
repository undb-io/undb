import { Modal } from '@egodb/ui'
import { useAtom } from 'jotai'
import { createFielModelOpened } from './create-field-modal-opened.atom'

export const CreateFieldModal: React.FC = () => {
  const [opened, setOpened] = useAtom(createFielModelOpened)
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Introduce yourself!">
      hello
    </Modal>
  )
}
