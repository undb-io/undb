import type { MantineTheme } from '@egodb/ui'
import styled from '@emotion/styled'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { TableUI } from '../table-ui/table-ui'
import { TreeViewUI } from '../tree-view-ui/tree-view-ui'
import type { ITableBaseProps } from './table-base-props'

const Wrapper = styled.div`
  background-color: ${({ theme }) => (theme as MantineTheme).white};
  height: 100%;
`

export const ViewDisplay: React.FC<ITableBaseProps> = ({ table }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return (
      <Wrapper>
        <KanbanUI table={table} />
      </Wrapper>
    )
  }

  if (displayType === 'calendar') {
    return (
      <Wrapper>
        <CalendarUI table={table} />
      </Wrapper>
    )
  }

  if (displayType === 'tree') {
    return (
      <Wrapper>
        <TreeViewUI table={table} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <TableUI table={table} />
    </Wrapper>
  )
}
