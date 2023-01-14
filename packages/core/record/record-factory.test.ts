import { Field, FieldId, FieldKey, FieldName, FieldValueConstraints, SelectField, StringField } from '../field'
import { Option, OptionColor, OptionKey, OptionName, Options } from '../option'
import { TableSchemaIdMap } from '../value-objects'
import { RecordFactory } from './record.factory'
import { IQueryRecordSchema } from './record.type'
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
  test.each<[IQueryRecordSchema, TableSchemaIdMap]>([
    [
      {
        id: 'rec1',
        tableId: 'tbl1',
        values: {
          field1: 'hello',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new Map([
        [
          'field1',
          new StringField({
            id: FieldId.fromString('id'),
            key: FieldKey.from('field1'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
          }),
        ],
      ]),
    ],
    [
      {
        id: 'rec1',
        tableId: 'tbl1',
        values: {
          field1: 'opt1',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new Map([
        [
          'field1',
          new SelectField({
            id: FieldId.fromString('id'),
            key: FieldKey.from('field1'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
            options: new Options([
              new Option({
                key: OptionKey.fromString('opt1'),
                name: OptionName.create('opt1'),
                color: OptionColor.defaultColor,
              }),
            ]),
          }),
        ],
      ]),
    ],
    [
      {
        id: 'rec1',
        tableId: 'tbl1',
        values: {
          field1: 'hello',
          field2: 'opt1',
        },
        createdAt: new Date(),
      },
      new Map<string, Field>([
        [
          'field1',
          new StringField({
            key: FieldKey.from('field1'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
          }),
        ],
        [
          'field2',
          new SelectField({
            key: FieldKey.from('field2'),
            name: FieldName.create('field2'),
            valueConstrains: FieldValueConstraints.create({}),
            options: new Options([new Option({ key: OptionKey.fromString('opt1'), name: OptionName.create('opt1') })]),
          }),
        ],
      ]),
    ],
  ])('should create record from query', (r, field) => {
    const record = RecordFactory.fromQuery(r, field)

    expect(record.isOk()).toBeTruthy()
    expect(record.unwrap().values.valueJSON).not.to.be.empty
    expect(record.unwrap().id.value).to.be.eq('rec1')
    expect(record.unwrap().tableId.value).to.be.eq('tbl1')
    expect(record.unwrap().values.valueJSON).toMatchSnapshot()
  })
})
