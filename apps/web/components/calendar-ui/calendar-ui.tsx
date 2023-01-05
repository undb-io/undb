import type { Records } from '@egodb/core'
import type { ICalendarField } from '@egodb/core/view/calendar'
import { Center, Container } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarBoard } from './calendar-board'
import { SelectCalendarField } from './select-calendar-field'

interface IProps extends ITableBaseProps {
  records: Records
}

export const CalendarUI: React.FC<IProps> = ({ table, records }) => {
  const view = table.mustGetView()
  const calendarFieldId = view.calendarFieldId.into()
  if (calendarFieldId) {
    const field = table.schema.getFieldById(calendarFieldId.value).into() as ICalendarField
    return <CalendarBoard table={table} records={records} field={field} />
  }

  return (
    <Container h="100%" w={450}>
      <Center h="100%" w="100%">
        <SelectCalendarField table={table} />
      </Center>
    </Container>
  )
}
