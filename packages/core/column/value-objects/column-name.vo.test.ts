import { ColumnName } from './column-name.vo'

it('should create new column name value object', () => {
  const columnName = ColumnName.create('hello')
  expect(columnName).toMatchInlineSnapshot(`
    ColumnName {
      "props": {
        "value": "hello",
      },
    }
  `)
  expect(columnName.value).toBe('hello')
})

it('should throw error if input is invlaue', () => {
  expect(() => ColumnName.create('')).toThrowErrorMatchingInlineSnapshot(`
    "[
      {
        \\"code\\": \\"too_small\\",
        \\"minimum\\": 2,
        \\"type\\": \\"string\\",
        \\"inclusive\\": true,
        \\"message\\": \\"String must contain at least 2 character(s)\\",
        \\"path\\": []
      }
    ]"
  `)
})

it('should throw error if input is too long', () => {
  expect(() => ColumnName.create('thisisaverylongnameexceed20?')).toThrowErrorMatchingInlineSnapshot(`
    "[
      {
        \\"code\\": \\"too_big\\",
        \\"maximum\\": 20,
        \\"type\\": \\"string\\",
        \\"inclusive\\": true,
        \\"message\\": \\"String must contain at most 20 character(s)\\",
        \\"path\\": []
      }
    ]"
  `)
})
