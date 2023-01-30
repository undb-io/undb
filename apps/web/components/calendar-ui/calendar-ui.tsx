import type { ICalendarField } from '@egodb/core'
import { Center, Container } from '@egodb/ui'
import type { ITableBaseProps } from '../table/table-base-props'
import { CalendarBoard } from './calendar-board'
import { SelectCalendarField } from './select-calendar-field'

export const CalendarUI: React.FC<ITableBaseProps> = ({ table }) => {
  const view = table.mustGetView()
  const calendarFieldId = view.calendarFieldId.into()
  if (calendarFieldId) {
    const field = table.schema.getFieldById(calendarFieldId.value).into() as ICalendarField
    return <CalendarBoard table={table} field={field} />
  }

  return (
    <Container h="100%" w={450}>
      <Center pb={200} h="100%" w="100%">
        <SelectCalendarField table={table} />
      </Center>
    </Container>
  )
}
