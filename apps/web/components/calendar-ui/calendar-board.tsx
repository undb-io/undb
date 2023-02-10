import { DndContext, rectIntersection } from '@dnd-kit/core'
import type { ICalendarField, Table } from '@egodb/core'
import { useUpdateRecordMutation } from '@egodb/store'
import { Grid } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarContent } from './calendar-content'
import { CalendarRecords } from './calendar-records'

interface IProps extends ITableBaseProps {
  table: Table
  field: ICalendarField
}

export const CalendarBoard: React.FC<IProps> = ({ table, field }) => {
  const [updateRecord] = useUpdateRecordMutation()

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
          <CalendarRecords table={table} field={field} />
        </Grid.Col>
        <Grid.Col h="100%" span={10}>
          <CalendarContent table={table} field={field} />
        </Grid.Col>
      </Grid>
    </DndContext>
  )
}
