import type { IKanbanField } from '@undb/core'
import { RecordFactory } from '@undb/core'
import styled from '@emotion/styled'
import { useCurrentTable } from '../../hooks/use-current-table'
import { KanbanDateBoard } from './kanban-date-board'
import { KanbanSelectBoard } from './kanban-select-board'
import { useFetchRecords } from '../../hooks/use-fetch-records'

interface IProps {
  field: IKanbanField
}

const Wrapper = styled.div`
  padding-top: '20px';
  height: 100%;
`

export const KanbanBoard: React.FC<IProps> = ({ field }) => {
  const table = useCurrentTable()
  const listRecords = useFetchRecords()

  const records = RecordFactory.fromQueryRecords(listRecords.rawRecords, table.schema.toIdMap())

  if (field.type === 'select') {
    return (
      <Wrapper>
        <KanbanSelectBoard field={field} records={records} />
      </Wrapper>
    )
  }

  if (field.type === 'date') {
    return (
      <Wrapper>
        <KanbanDateBoard field={field} />
      </Wrapper>
    )
  }

  return null
}

export default KanbanBoard
