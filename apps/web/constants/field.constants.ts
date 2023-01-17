import type { SelectItem } from '@egodb/ui'

export const FIELD_SELECT_ITEMS: SelectItem[] = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'date-range', label: 'DateRange' },
  { value: 'bool', label: 'Bool' },
  { value: 'select', label: 'Select' },
  { value: 'reference', label: 'Reference' },
]

export const ACTIONS_FIELD = 'actions'
