import { Button, openContextModal, Stack } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { CREATE_VIEW_MODAL_ID } from '../../modals'
import { ViewsListItem } from './views-list-item'

export const ViewsList: React.FC = () => {
  const table = useCurrentTable()
  const views = table.views.views

  return (
    <Stack h="100%" justify="space-between">
      <Stack spacing={5}>
        {views.map((v) => (
          <ViewsListItem key={v.id.value} v={v} />
        ))}
      </Stack>
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
