import { Button, IconMenu2, Tooltip } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useCurrentTable } from '../../hooks/use-current-table'
import { viewsOpenedAtom } from '../views/views-opened.atom'

export const ViewsButton: React.FC = () => {
  const setOpened = useSetAtom(viewsOpenedAtom)
  const table = useCurrentTable()

  const viewsCount = table.views.count

  return (
    <Tooltip label={viewsCount > 1 ? `${viewsCount} views` : `${viewsCount} view`}>
      <Button compact size="xs" leftIcon={<IconMenu2 size={14} />} variant="subtle" onClick={() => setOpened(true)}>
        Views
      </Button>
    </Tooltip>
  )
}
