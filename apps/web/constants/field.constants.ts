import type { SelectItem } from '@egodb/ui'

export const FIELD_SELECT_ITEMS: SelectItem[] = [
  { value: 'string', label: 'String', type: 'string' },
  { value: 'number', label: 'Number', type: 'number' },
  { value: 'date', label: 'Date', type: 'date' },
  { value: 'date-range', label: 'DateRange', type: 'date-range' },
  { value: 'bool', label: 'Bool', type: 'bool' },
  { value: 'select', label: 'Select', type: 'select' },
]

export const ACTIONS_FIELD = 'actions'
