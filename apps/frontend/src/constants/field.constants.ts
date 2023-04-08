import type { SelectItem } from '@undb/ui'

export const FIELD_SELECT_ITEMS: SelectItem[] = [
  { value: 'string', label: 'String', group: 'Base' },
  { value: 'email', label: 'Email', group: 'Base' },
  { value: 'attachment', label: 'Attachment', group: 'Base' },
  { value: 'color', label: 'Color', group: 'Base' },
  { value: 'bool', label: 'Bool', group: 'Base' },
  { value: 'number', label: 'Number', group: 'Base' },
  { value: 'rating', label: 'Rating', group: 'Base' },
  { value: 'date', label: 'Date', group: 'Base' },
  { value: 'date-range', label: 'DateRange', group: 'Base' },
  { value: 'auto-increment', label: 'AutoIncrement', group: 'System' },
  { value: 'select', label: 'Select', group: 'Base' },
  { value: 'reference', label: 'Reference', group: 'Reference' },
  { value: 'tree', label: 'Tree', group: 'Reference' },
  { value: 'lookup', label: 'Lookup', group: 'Lookup' },
  { value: 'count', label: 'Count', group: 'Lookup' },
  { value: 'sum', label: 'Sum', group: 'Lookup' },
  { value: 'average', label: 'Average', group: 'Lookup' },
]

export const ACTIONS_FIELD = 'actions'
export const SELECTION_ID = 'selection'
