import { DndContext, rectIntersection } from '@dnd-kit/core'
import type { ICalendarField, IQueryRecords, Table } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery, useUpdateRecordMutation } from '@egodb/store'
import { Calendar, Grid } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarRecords } from './calendar-records'
import { Day } from './day'

interface IProps extends ITableBaseProps {
  table: Table
  field: ICalendarField
}

export const CalendarBoard: React.FC<IProps> = ({ table, field }) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {}

  const listRecords = useGetRecordsQuery(
    {
      tableId: table.id.value,
    },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
      }),
    },
  )

  const records = RecordFactory.fromQueryRecords(listRecords.rawRecords, table.schema.toIdMap())

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
          <CalendarRecords field={field} records={records} />
        </Grid.Col>
        <Grid.Col h="100%" span={10}>
          <Calendar
            onChange={onChange}
            h="100%"
            fullWidth
            bg="white"
            size="xl"
            allowLevelChange={false}
            renderDay={(date) => <Day field={field} records={records} date={date} />}
            styles={(theme) => {
              const border = `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`
              return {
                calendarHeader: {
                  backgroundColor: theme.white,
                  marginBottom: 0,
                  padding: 10,
                  borderLeft: border,
                },
                calendarHeaderControl: {
                  height: theme.spacing.xs + 'px',
                },
                calendarHeaderLevel: {
                  height: '100%',
                  fontSize: theme.fontSizes.lg,
                },
                month: { height: 'calc(100% - 40px)' },
                cell: {
                  height: 'calc(100% / 6)',
                  border: border,
                },
                day: {
                  cursor: 'unset',
                  borderRadius: 0,
                  height: '100%',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  fontSize: theme.fontSizes.sm,
                },
                weekday: { fontSize: theme.fontSizes.lg },
                weekdayCell: {
                  fontSize: theme.fontSizes.xs,
                  border: border,
                  height: 20,
                },
              }
            }}
          />
        </Grid.Col>
      </Grid>
    </DndContext>
  )
}
