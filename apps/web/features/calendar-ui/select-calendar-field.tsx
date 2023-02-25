import { Box } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import { calendarStep } from './calendar-step.atom'
import { CreateCalendarDateField } from './create-calendar-date-field'
import { CreateCalendarDateRangeField } from './create-calendar-date-range-field'
import type { ISelectCalendarFieldProps } from './select-calendar-field.props'
import { SelectExistingCalendarField } from './select-existing-calendar-field'

export const SelectCalendarField: React.FC<ISelectCalendarFieldProps> = ({ onSuccess }) => {
  const step = useAtomValue(calendarStep)

  return (
    <Box w={500}>
      {step === 0 ? <SelectExistingCalendarField onSuccess={onSuccess} /> : null}
      {step === 1 ? <CreateCalendarDateField onSuccess={onSuccess} /> : null}
      {step === 2 ? <CreateCalendarDateRangeField onSuccess={onSuccess} /> : null}
    </Box>
  )
}
