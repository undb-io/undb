import { Field, FieldId, FieldName, FieldValueConstraints, SelectField, StringField } from '../field/index.js'
import { Option, OptionColor, OptionKey, OptionName, Options } from '../option/index.js'
import { TableSchemaIdMap } from '../value-objects/index.js'
import { RecordFactory } from './record.factory.js'
import { IQueryRecordSchema } from './record.type.js'
import { WithRecordId, WithRecordTableId } from './specifications/index.js'
import { RecordCompositeSpecification } from './specifications/interface.js'

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
        autoIncrement: 1,
        displayValues: {},
      },
      new Map([
        [
          'field1',
          new StringField({
            id: FieldId.fromString('id'),
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
        autoIncrement: 1,
        displayValues: {},
      },
      new Map([
        [
          'field1',
          new SelectField({
            id: FieldId.fromString('id'),
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
        updatedAt: new Date(),
        autoIncrement: 1,
        displayValues: {},
      },
      new Map<string, Field>([
        [
          'field1',
          new StringField({
            id: FieldId.fromNullableString('field1'),
            name: FieldName.create('field1'),
            valueConstrains: FieldValueConstraints.create({}),
          }),
        ],
        [
          'field2',
          new SelectField({
            id: FieldId.fromNullableString('field1'),
            name: FieldName.create('field2'),
            valueConstrains: FieldValueConstraints.create({}),
            options: new Options([
              new Option({
                key: OptionKey.fromString('opt1'),
                name: OptionName.create('name'),
                color: OptionColor.defaultColor,
              }),
            ]),
          }),
        ],
      ]),
    ],
  ])('should create record from query.js', (r, field) => {
    const record = RecordFactory.fromQuery(r, field)

    expect(record.isOk()).toBeTruthy()
    expect(record.unwrap().values.valuesPair).not.to.be.empty
    expect(record.unwrap().id.value).to.be.eq('rec1')
    expect(record.unwrap().tableId.value).to.be.eq('tbl1')
    expect(record.unwrap().values.valuesPair).toMatchSnapshot()
  })
})
