import type { Records } from '@egodb/core'
import type { MantineTheme } from '@egodb/ui'
import styled from '@emotion/styled'
import { CalendarUI } from '../calendar-ui/calendar-ui'
import { KanbanUI } from '../kanban-ui/kanban-ui'
import { EGOTable } from '../table-ui/table'
import type { ITableBaseProps } from './table-base-props'

interface IProps extends ITableBaseProps {
  records: Records
}

const Wrapper = styled.div`
  background-color: ${({ theme }) => (theme as MantineTheme).white};
  height: 100%;
`

export const ViewDisplay: React.FC<IProps> = ({ table, records }) => {
  const displayType = table.mustGetView().displayType
  if (displayType === 'kanban') {
    return (
      <Wrapper>
        <KanbanUI table={table} records={records} />
      </Wrapper>
    )
  }

  if (displayType === 'calendar') {
    return (
      <Wrapper>
        <CalendarUI table={table} records={records} />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <EGOTable table={table} records={records} />
    </Wrapper>
  )
}
