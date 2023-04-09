import type { IKanbanField } from '@undb/core'
import { Box, Overlay } from '@undb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { SelectKanbanField } from './select-kanban-field'
import { lazy } from 'react'

const KanbanBoard = lazy(() => import('./kanban-board'))

export const KanbanUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const fieldId = view.kanbanFieldId

  if (fieldId.isNone()) {
    return (
      <Box h="100%" sx={{ position: 'relative' }}>
        <Overlay center>
          <Box w={500}>
            <SelectKanbanField />
          </Box>
        </Overlay>
      </Box>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <KanbanBoard field={field as IKanbanField} />
}
