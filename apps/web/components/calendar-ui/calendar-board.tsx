import type { ICalendarField, Records } from '@egodb/core'
import { Calendar, Grid } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarRecords } from './calendar-records'
import { Day } from './day'

interface IProps extends ITableBaseProps {
  field: ICalendarField
  records: Records
}

export const CalendarBoard: React.FC<IProps> = ({ field, records }) => {
  const [date, setDate] = useState<Date | null>(null)
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onChange = (date: Date) => {
    setDate(date)
    setOpened(true)
    setInitialValue({ [field.id.value]: date })
  }

  return (
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
          styles={(theme) => ({
            calendarHeader: {
              height: 30,
              marginBottom: 0,
              paddingBottom: 10,
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            },
            calendarHeaderControl: {
              height: '100%',
            },
            calendarHeaderLevel: {
              height: '100%',
              fontSize: theme.fontSizes.md,
            },
            month: { height: 'calc(100% - 40px)' },
            cell: {
              height: 'calc(100% / 6)',
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`,
            },
            day: {
              padding: theme.spacing.xs,
              paddingTop: theme.spacing.sm,
              paddingBottom: theme.spacing.sm,
              borderRadius: 0,
              height: '100%',
              display: 'inline-flex',
              flexDirection: 'column',
              fontSize: theme.fontSizes.sm,
            },
            weekday: { fontSize: theme.fontSizes.lg },
            weekdayCell: {
              fontSize: theme.fontSizes.xs,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`,
              height: 20,
            },
          })}
        />
      </Grid.Col>
    </Grid>
  )
}
