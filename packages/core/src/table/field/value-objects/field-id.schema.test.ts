import { fieldIdSchema } from './field-id.schema'

test.each([
  ['fld123', true],
  // ['fld abc', false],
  ['123', false],
  [123, false],
  [false, false],
  [true, false],
  [Symbol(123), false],
  [null, false],
  [undefined, false],
  ['AbcFld', false],
  ['fldA12_Bx', true],
  [{ id: 'fldAbc123' }, false],
  // ['FLD12ab', false],
])('%s is true', (s, excepted) => {
  expect(fieldIdSchema.safeParse(s).success).toBe(excepted)
})
