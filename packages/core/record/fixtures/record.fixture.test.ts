import { NumberFieldValue, StringFieldValue } from '../../field'
import { NumberEqual, StringEqual } from '../specifications'
import { RecordCompositeSpecification } from '../specifications/interface'
import { createTestRecord } from './record.fixture'

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
