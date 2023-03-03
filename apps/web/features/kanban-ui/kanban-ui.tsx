import type { IKanbanField } from '@egodb/core'
import { Box, Overlay } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { KanbanBoard } from './kanban-board'
import { SelectKanbanField } from './select-kanban-field'

export const KanbanUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const fieldId = view.kanbanFieldId

  if (fieldId.isNone()) {
    return (
      <Box h="100%" sx={{ position: 'relative' }}>
        <Overlay center>
          <SelectKanbanField />
        </Overlay>
      </Box>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <KanbanBoard field={field as IKanbanField} />
}
