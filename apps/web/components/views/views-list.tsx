import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button, openContextModal, Stack, useListState } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { CREATE_VIEW_MODAL_ID } from '../../modals'
import { ViewsListItem } from './views-list-item'

export const ViewsList: React.FC = () => {
  const table = useCurrentTable()
  const views = table.views.views

  const viewsOrder = table.viewsOrder.order
  const [order, handlers] = useListState(viewsOrder)

  return (
    <Stack h="100%" justify="space-between">
      <Stack spacing={5}>
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={(e) => {
            const { over, active } = e
            if (over) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over?.data.current?.sortable?.index,
              })
            }
          }}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {views.map((v) => (
              <ViewsListItem key={v.id.value} v={v} />
            ))}
          </SortableContext>
        </DndContext>
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
