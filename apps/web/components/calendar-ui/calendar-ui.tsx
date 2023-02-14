import type { ICalendarField } from '@egodb/core'
import { Center, Container } from '@egodb/ui'
import { useCurrentTable } from '../../hooks/use-current-table'
import { useCurrentView } from '../../hooks/use-current-view'
import { CalendarBoard } from './calendar-board'
import { SelectCalendarField } from './select-calendar-field'

export const CalendarUI: React.FC = () => {
  const table = useCurrentTable()
  const view = useCurrentView()
  const calendarFieldId = view.calendarFieldId.into()
  if (calendarFieldId) {
    const field = table.schema.getFieldById(calendarFieldId.value).into() as ICalendarField
    return <CalendarBoard field={field} />
  }

  return (
    <Container h="100%" w={450}>
      <Center pb={200} h="100%" w="100%">
        <SelectCalendarField />
      </Center>
    </Container>
  )
}
