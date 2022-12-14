import { FieldValueFactory } from './field-value.factory'
import { IFieldValue } from './field.type'

test.each<IFieldValue>(['hello', 1, null])('field value test', (value) => {
  const fieldValue = FieldValueFactory.from(value)
  expect(fieldValue).toMatchSnapshot()
})
