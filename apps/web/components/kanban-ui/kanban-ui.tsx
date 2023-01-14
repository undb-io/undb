import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import { Container, Center } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanBoard } from './kanban-board'
import { SelectKanbanField } from './select-kanban-field'

interface IProps extends ITableBaseProps {
  records: Records
}

export const KanbanUI: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const fieldId = view.kanbanFieldId

  if (fieldId.isNone()) {
    return (
      <Container h="100%" w={450}>
        <Center pb={200} h="100%" w="100%">
          <SelectKanbanField table={table} />
        </Center>
      </Container>
    )
  }

  const field = table.schema.getFieldById(fieldId.unwrap().value).unwrap()
  return <KanbanBoard table={table} field={field as IKanbanField} records={records} />
}
