import type { IKanbanField } from '@egodb/core'
import { Container, Center } from '@egodb/ui'
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
      <Container h="100%" w={450} sx={{ overflow: 'scroll' }}>
        <Center pb={200} h="100%" w="100%" sx={{ overflow: 'scroll' }}>
          <SelectKanbanField />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <KanbanBoard field={field as IKanbanField} />
}
