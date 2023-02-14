import { DndContext, rectIntersection } from '@dnd-kit/core'
import type { ICalendarField } from '@egodb/core'
import { useUpdateRecordMutation } from '@egodb/store'
import { Grid } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { CalendarContent } from './calendar-content'
import { CalendarRecords } from './calendar-records'

interface IProps {
  field: ICalendarField
}

export const CalendarBoard: React.FC<IProps> = ({ field }) => {
  const [updateRecord] = useUpdateRecordMutation()
  const table = useCurrentTable()

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const recordId = e.active.id
        const date = e.over?.id
        if (date) {
          updateRecord({
            tableId: table.id.value,
            id: recordId as string,
            value: [{ id: field.id.value, value: new Date(date) }],
          })
        }
      }}
    >
      <Grid h="100%" gutter={0} sx={{ overflow: 'hidden' }}>
        <Grid.Col h="100%" span={2} pb={50}>
          <CalendarRecords field={field} />
        </Grid.Col>
        <Grid.Col h="100%" span={10}>
          <CalendarContent field={field} />
        </Grid.Col>
      </Grid>
    </DndContext>
  )
}
