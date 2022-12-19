import { DndContext } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { flexRender } from '@tanstack/react-table'
import { ACTIONS_FIELD } from '../../constants/field.constants'
import type { THeaderGroup } from './interface'
import { Th } from './th'

export const Thead: React.FC<{ headerGroup: THeaderGroup; tableId: string }> = ({ headerGroup, tableId }) => {
  return (
    <DndContext modifiers={[restrictToHorizontalAxis]}>
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) =>
          header.id === ACTIONS_FIELD ? (
            <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
          ) : (
            <Th header={header} key={header.id} tableId={tableId} />
          ),
        )}
      </tr>
    </DndContext>
  )
}
