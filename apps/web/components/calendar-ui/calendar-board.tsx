import type { QueryRecords } from '@egodb/core'
import type { ICalendarField } from '@egodb/core/view/calendar'
import { Calendar, Container } from '@egodb/ui'
import { useSetAtom } from 'jotai'
import { useState } from 'react'
import { createRecordInitialValueAtom } from '../create-record-form/create-record-initial-value.atom'
import { createRecordFormDrawerOpened } from '../create-record-form/drawer-opened.atom'
import type { ITableBaseProps } from '../table/table-base-props'
import { Day } from './day'

interface IProps extends ITableBaseProps {
  field: ICalendarField
  records: QueryRecords
}

export const CalendarBoard: React.FC<IProps> = ({ field }) => {
  const [date, setDate] = useState<Date | null>(null)
  const setOpened = useSetAtom(createRecordFormDrawerOpened)
  const setInitialValue = useSetAtom(createRecordInitialValueAtom)

  const onChange = (date: Date) => {
    setDate(date)
    setOpened(true)
    setInitialValue({ [field.name.value]: date })
  }

  return (
    <Container w="100%" h="100%" maw="100%" p={0}>
      <Calendar
        value={date}
        onChange={onChange}
        h="100%"
        bg="white"
        fullWidth
        size="xl"
        allowLevelChange={false}
        renderDay={(date) => <Day date={date} />}
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
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]}`,
          },
          day: {
            padding: theme.spacing.xs,
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
    </Container>
  )
}
