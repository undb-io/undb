import { SelectField } from '@egodb/core'
import type { IKanbanField } from '@egodb/core/view/kanban.schema'
import { Container, Group } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanLane } from './kanban-lane'

interface IProps extends ITableBaseProps {
  field: IKanbanField
}

export const KanbanBoard: React.FC<IProps> = ({ field }) => {
  if (field instanceof SelectField) {
    return (
      <Container fluid ml={0}>
        <Group>
          {field.options.options.map((option) => (
            <KanbanLane key={option.id.value} title={option.name.value} />
          ))}
        </Group>
      </Container>
    )
  }

  return <>board</>
}
