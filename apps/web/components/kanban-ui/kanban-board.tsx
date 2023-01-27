import type { Records } from '@egodb/core'
import type { IKanbanField } from '@egodb/core'
import type { MantineTheme } from '@egodb/ui'
import styled from '@emotion/styled'
import type { ITableBaseProps } from '../table/table-base-props'
import { KanbanDateBoard } from './kanban-date-board'
import { KanbanSelectBoard } from './kanban-select-board'

interface IProps extends ITableBaseProps {
  field: IKanbanField
}

const Wrapper = styled.div`
  padding-top: ${({ theme }) => (theme as MantineTheme).spacing.md + 'px'};
  height: 100%;
`

export const KanbanBoard: React.FC<IProps> = ({ field, table }) => {
  if (field.type === 'select') {
    return (
      <Wrapper>
        <KanbanSelectBoard field={field} table={table} />
      </Wrapper>
    )
  }

  if (field.type === 'date') {
    return (
      <Wrapper>
        <KanbanDateBoard field={field} table={table} />
      </Wrapper>
    )
  }

  return null
}
