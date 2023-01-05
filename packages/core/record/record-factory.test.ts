import { FieldId, FieldName, FieldValueConstraints, StringField } from '../field'
import { RecordFactory } from './record.factory'
import { WithRecordId, WithRecordTableId } from './specifications'
import { RecordCompositeSpecification } from './specifications/interface'

beforeAll(() => {
  vi.setSystemTime(new Date(2022, 1, 1))
})

test.each<RecordCompositeSpecification>([
  WithRecordTableId.fromString('table').unwrap().and(WithRecordId.fromString('record')),
])('should create record', (spec) => {
  const record = RecordFactory.create(spec)

  expect(record).toMatchSnapshot()
})

describe('fromQuery', () => {
  test('should create record from query', () => {
    const record = RecordFactory.fromQuery(
      {
        id: 'rec1',
        tableId: 'tbl1',
        values: {
          field1: 'hello',
        },
        createdAt: new Date(),
      },
      new Map([
        [
          'field1',
          new StringField({
            id: FieldId.from('field1'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
          }),
        ],
      ]),
    )

    expect(record.isOk()).toBeTruthy()
    expect(record.unwrap().values.valueJSON).not.to.be.empty
    expect(record.unwrap().id.value).to.be.eq('rec1')
    expect(record.unwrap().tableId.value).to.be.eq('tbl1')
    expect(record.unwrap().values.valueJSON).toMatchInlineSnapshot(`
      {
        "field1": StringFieldValue {
          "props": {
            "value": "hello",
          },
        },
      }
    `)
  })
})
