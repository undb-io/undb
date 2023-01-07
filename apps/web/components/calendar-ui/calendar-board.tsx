import { DndContext, rectIntersection } from '@dnd-kit/core'
import type { ICalendarField, Records, Table } from '@egodb/core'
import { Calendar, Grid } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { trpc } from '../../trpc'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarRecords } from './calendar-records'
import { Day } from './day'

interface IProps extends ITableBaseProps {
  table: Table
  field: ICalendarField
  records: Records
}

export const CalendarBoard: React.FC<IProps> = ({ table, field, records }) => {
  const [date, setDate] = useState<Date | null>(null)
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onChange = (date: Date) => {
    setDate(date)
    setOpened(true)
    setInitialValue({ [field.id.value]: date })
  }

  const utils = trpc.useContext()
  const updateRecord = trpc.record.update.useMutation({
    onSuccess() {
      utils.record.list.refetch()
    },
  })

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={(e) => {
        const recordId = e.active.id
        const date = e.over?.id
        if (date) {
          updateRecord.mutate({
            tableId: table.id.value,
            id: recordId as string,
            value: [{ id: field.id.value, value: new Date(date) }],
          })
        }
      }}
    >
      <Grid h="100%" gutter={0}>
        <Grid.Col span={2}>
          <CalendarRecords field={field} records={records} />
        </Grid.Col>
        <Grid.Col span={10}>
          <Calendar
            value={date}
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
