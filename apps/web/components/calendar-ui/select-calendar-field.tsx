import { Box } from '@egodb/ui'
import { useAtomValue } from 'jotai'
import type { ITableBaseProps } from '../table/table-base-props'
import { calendarStep } from './calendar-step.atom'
import { CreateCalendarDateField } from './create-calendar-date-field'
import { CreateCalendarDateRangeField } from './create-calendar-date-range-field'
import { SelectExistingCalendarField } from './select-existing-calendar-field'

interface IProps extends ITableBaseProps {
  onSuccess?: () => void
}

export const SelectCalendarField: React.FC<IProps> = ({ table, onSuccess }) => {
  const step = useAtomValue(calendarStep)

  return (
    <Box w={500}>
      {step === 0 ? <SelectExistingCalendarField onSuccess={onSuccess} table={table} /> : null}
      {step === 1 ? <CreateCalendarDateField onSuccess={onSuccess} table={table} /> : null}
      {step === 2 ? <CreateCalendarDateRangeField onSuccess={onSuccess} table={table} /> : null}
    </Box>
  )
}
