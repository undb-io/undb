import { ColumnName } from './column-name.vo'

it('should create new column name value object', () => {
  const columnName = new ColumnName('hello')
  expect(columnName).toMatchInlineSnapshot(`
    ColumnName {
      "props": {
        "value": "hello",
      },
    }
  `)
})

it('should throw error if input is invlaue', () => {
  expect(() => new ColumnName('')).toThrowErrorMatchingInlineSnapshot(`
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
  expect(() => new ColumnName('thisisaverylongnameexceed20?')).toThrowErrorMatchingInlineSnapshot(`
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
