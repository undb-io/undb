import {
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  StringField,
} from '../field/index.js'
import { createTestRecord } from './fixtures/index.js'
import { WithRecordValues } from './specifications/index.js'

describe('Record', () => {
  beforeAll(() => {
    vi.setSystemTime(new Date(2022, 2, 2))
  })

  test('valuesPair', () => {
    const record = createTestRecord(
      WithRecordValues.fromArray([
        {
          type: 'string',
          value: 'string',
          field: StringField.create({ id: 'fldid', name: 'name' }),
        },
      ]),
    )

    const valuesJson = record.valuesPair

    expect(valuesJson).to.have.property(INTERNAL_COLUMN_ID_NAME)
    expect(valuesJson).to.have.property(INTERNAL_COLUMN_CREATED_AT_NAME)
    expect(valuesJson).to.have.property(INTERNAL_COLUMN_UPDATED_AT_NAME)
    expect(valuesJson).to.have.property('fldid')
  })
})
