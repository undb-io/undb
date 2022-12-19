import { DndContext } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { flexRender } from '@tanstack/react-table'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import { trpc } from '../../trpc'
import type { THeaderGroup } from './interface'
import { Th } from './th'

export const Thead: React.FC<{ headerGroup: THeaderGroup; tableId: string }> = ({ headerGroup, tableId }) => {
  const utils = trpc.useContext()
  const moveField = trpc.table.moveField.useMutation({
    onSuccess() {
      utils.table.get.refetch()
    },
  })

  const items = headerGroup.headers.filter((h) => h.id !== ACTIONS_FIELD).map((h) => h.id)

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={({ over, active }) => {
        if (over) {
          moveField.mutate({ tableId, from: active.id as string, to: over.id as string })
        }
      }}
    >
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) =>
            header.id === ACTIONS_FIELD ? (
              <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
            ) : (
              <Th header={header} key={header.id} tableId={tableId} />
            ),
          )}
        </tr>
      </SortableContext>
    </DndContext>
  )
}
