import { closestCenter, DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMoveViewMutation } from '@egodb/store'
import { Button, openContextModal, Stack, useListState } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { CREATE_VIEW_MODAL_ID } from '../../modals'
import { ViewsListItem } from './views-list-item'

export const ViewsList: React.FC = () => {
  const table = useCurrentTable()
  const views = table.views.views
  const viewsMap = new Map(views.map((v) => [v.id.value, v]))

  const viewsOrder = table.viewsOrder.order
  const [order, handlers] = useListState(viewsOrder)

  const [moveView] = useMoveViewMutation()

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

              moveView({
                tableId: table.id.value,
                from: active.id as string,
                to: over.id as string,
              })
            }
          }}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {order.map((id) => {
              const v = viewsMap.get(id)
              if (!v) return null
              return <ViewsListItem key={id} v={v} />
            })}
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
