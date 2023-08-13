import { IFieldType } from './field.type'
import { canChangeType } from './field.util'

test.each<[IFieldType, boolean]>([
  ['string', true],
  ['attachment', true],
  ['email', true],
  ['url', true],
  ['json', true],
  ['color', true],
  ['date', true],
  ['number', true],
  ['date-range', true],
  ['select', true],
  ['bool', true],
  ['rating', true],
  ['multi-select', true],
  ['currency', true],
  ['collaborator', true],
  ['average', true],
  ['sum', true],
  ['lookup', true],
  ['reference', false],
  ['min', true],
  ['max', true],
  ['id', false],
  ['created-by', false],
  ['updated-by', false],
  ['created-at', false],
  ['updated-at', false],
  ['auto-increment', false],
  ['tree', false],
  ['parent', false],
])('%s can change field type', (type, excepted) => {
  expect(canChangeType(type)).toBe(excepted)
})
