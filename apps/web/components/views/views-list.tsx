import { Button, List, openContextModal, Stack } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import Link from 'next/link'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CREATE_VIEW_MODAL_ID } from '../../modals'
import { DisplayTypeIcon } from '../view/display-type-icon'
import { viewsOpenedAtom } from './views-opened.atom'

export const ViewsList: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const views = table.views.views
  const setOpened = useSetAtom(viewsOpenedAtom)

  return (
    <Stack h="100%" justify="space-between">
      <List center>
        {views.map((v) => (
          <List.Item icon={<DisplayTypeIcon displayType={view.displayType} />} key={v.id.value}>
            <Link href={`/t/${table.id.value}/${v.id.value}`} onClick={() => setOpened(false)}>
              {v.name.value}
            </Link>
          </List.Item>
        ))}
      </List>
      <Button
        variant="light"
        onClick={() => {
          openContextModal({
            title: 'Create New View',
            modal: CREATE_VIEW_MODAL_ID,
            innerProps: {},
          })
        }}
      >
        Create New View
      </Button>
    </Stack>
  )
}
