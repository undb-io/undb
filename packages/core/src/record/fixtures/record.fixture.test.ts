import { NumberFieldValue, StringFieldValue } from '../../field/index.js'
import { NumberEqual, StringEqual } from '../specifications/index.js'
import { RecordCompositeSpecification } from '../specifications/interface.js'
import { createTestRecord } from './record.fixture.js'

beforeAll(() => {
  vi.setSystemTime(new Date(2022, 1, 1))
})

test.each<RecordCompositeSpecification[][]>([
  [[new StringEqual('hello', new StringFieldValue('world'))]],
  [[new NumberEqual('hello', new NumberFieldValue(1))]],
  [[new StringEqual('hello', new StringFieldValue('world')), new NumberEqual('number', new NumberFieldValue(1))]],
])('createTestRecord', (specs) => {
  const record = createTestRecord(...specs)
  expect(record).toMatchSnapshot()
})
