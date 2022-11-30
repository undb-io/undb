import { ColumnFactory } from './column.factory'
import { Column } from './column.type'
import { NumberColumn } from './number.column'
import { TextColumn } from './text.column'
import { ColumnName } from './value-objects'

it('should create text column', () => {
  const column = ColumnFactory.create({
    type: 'text',
    name: 'hello',
    id: 'abc',
  })

  expectTypeOf(column).toEqualTypeOf<Column>()
  expect(column).toBeInstanceOf(TextColumn)
  expect(column.type).toBe('text')
  expect(column.name).toBeInstanceOf(ColumnName)
  expect(column.name.value).toBe('hello')
})

it('should create number column', () => {
  const column = ColumnFactory.create({
    type: 'number',
    name: 'hello',
    id: 'abc',
  })

  expectTypeOf(column).toEqualTypeOf<Column>()
  expect(column).toBeInstanceOf(NumberColumn)
  expect(column.type).toBe('number')
  expect(column.name).toBeInstanceOf(ColumnName)
  expect(column.name.value).toBe('hello')
})
