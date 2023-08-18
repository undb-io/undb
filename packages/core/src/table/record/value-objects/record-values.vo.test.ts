import { Field, StringField } from '../../field'
import { IQueryRecordValues } from '../record.type'
import { RecordValues } from './record-values.vo'

test('should create record values from object', () => {
  const id = 'fld1'
  const field = StringField.create({ id, name: 'field1' })

  const schemaMap = new Map<string, Field>([[id, field]])
  const inputs: IQueryRecordValues = { [id]: 'hello' }

  const values = RecordValues.fromObject(schemaMap, inputs)

  expect(values.valuesJSON).toMatchInlineSnapshot(`
    {
      "fld1": "hello",
    }
  `)
})

test('should ignore unknow fields', () => {
  const id = 'fld1'
  const field = StringField.create({ id, name: 'field1' })

  const schemaMap = new Map<string, Field>([['fld2', field]])
  const inputs: IQueryRecordValues = { [id]: 'hello' }

  const values = RecordValues.fromObject(schemaMap, inputs)

  expect(values.valuesJSON).to.be.empty
})
