import type { SelectItem } from '@egodb/ui'

export const FIELD_SELECT_ITEMS: SelectItem[] = [
  { value: 'string', label: 'String' },
  { value: 'email', label: 'Email' },
  { value: 'color', label: 'Color' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating' },
  { value: 'date', label: 'Date' },
  { value: 'date-range', label: 'DateRange' },
  { value: 'auto-increment', label: 'AutoIncrement' },
  { value: 'bool', label: 'Bool' },
  { value: 'select', label: 'Select' },
  { value: 'reference', label: 'Reference' },
  { value: 'count', label: 'Count' },
  { value: 'tree', label: 'Tree' },
]

export const ACTIONS_FIELD = 'actions'
export const SELECTION_ID = 'selection'
