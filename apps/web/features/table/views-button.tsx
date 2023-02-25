import { Button, IconMenu2 } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { viewsOpenedAtom } from '../views/views-opened.atom'

export const ViewsButton: React.FC = () => {
  const setOpened = useSetAtom(viewsOpenedAtom)

  return (
    <Button compact size="xs" leftIcon={<IconMenu2 size={14} />} variant="subtle" onClick={() => setOpened(true)}>
      Views
    </Button>
  )
}
