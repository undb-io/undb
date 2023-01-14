import {
  INTERNAL_FIELD_CREATED_AT_NAME,
  INTERNAL_FIELD_ID_NAME,
  INTERNAL_FIELD_UPDATED_AT_NAME,
  StringField,
} from '../field'
import { createTestRecord } from './fixtures'
import { WithRecordValues } from './specifications'

describe('Record', () => {
  beforeAll(() => {
    vi.setSystemTime(new Date(2022, 2, 2))
  })

  test('valuesJSON', () => {
    const record = createTestRecord(
      WithRecordValues.fromArray([
        {
          type: 'string',
          value: 'string',
          field: StringField.create({ key: 'stringField', name: 'name', type: 'string' }),
        },
      ]),
    )

    const valuesJson = record.valuesJSON

    expect(valuesJson).to.have.property(INTERNAL_FIELD_ID_NAME)
    expect(valuesJson).to.have.property(INTERNAL_FIELD_CREATED_AT_NAME)
    expect(valuesJson).to.have.property(INTERNAL_FIELD_UPDATED_AT_NAME)
    expect(valuesJson).to.have.property('stringField')
  })
})
