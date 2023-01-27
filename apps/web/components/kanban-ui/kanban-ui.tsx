import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import { Container, Center } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanBoard } from './kanban-board'
import { SelectKanbanField } from './select-kanban-field'

export const KanbanUI: React.FC<ITableBaseProps> = ({ table }) => {
  const view = table.mustGetView()
  const fieldId = view.kanbanFieldId

  if (fieldId.isNone()) {
    return (
      <Container h="100%" w={450} sx={{ overflow: 'scroll' }}>
        <Center pb={200} h="100%" w="100%" sx={{ overflow: 'scroll' }}>
          <SelectKanbanField table={table} />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()

  return <KanbanBoard table={table} field={field as IKanbanField} />
}
