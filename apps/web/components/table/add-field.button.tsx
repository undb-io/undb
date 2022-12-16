import { Button } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { createFielModelOpened } from '../create-field-form/create-field-modal-opened.atom'

export const AddFieldButton: React.FC = () => {
  const setOpened = useSetAtom(createFielModelOpened)
  return (
    <Button size="xs" miw={120} variant="outline" onClick={() => setOpened(true)}>
      Add Field
    </Button>
  )
}
