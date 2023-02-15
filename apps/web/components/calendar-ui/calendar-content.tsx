import type { ICalendarField, IQueryRecords } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import { useGetRecordsQuery } from '@egodb/store'
import { Calendar } from '@egodb/ui'
import { useMemo } from 'react'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { Day } from './day'

interface IProps {
  field: ICalendarField
}
export const CalendarContent: React.FC<IProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {}
  const table = useCurrentTable()
  const view = useCurrentView()

  const { rawRecords } = useGetRecordsQuery(
    {
      tableId: table.id.value,
      viewId: view.id.value,
      filter: [{ path: field.id.value, type: 'date', value: null, operator: '$neq' }],
    },
    {
      selectFromResult: (result) => ({
        ...result,
        rawRecords: (Object.values(result.data?.entities ?? {}) ?? []).filter(Boolean) as IQueryRecords,
      }),
    },
  )

  const records = useMemo(() => RecordFactory.fromQueryRecords(rawRecords, table.schema.toIdMap()), [rawRecords])

  return (
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
          month: {
            height: 'calc(100% - 40px)',
          },
          cell: {
            height: 'calc(100% / 6)',
            overflowY: 'scroll',
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
  )
}
