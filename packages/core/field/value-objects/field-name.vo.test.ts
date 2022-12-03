import { FieldName } from './field-name.vo'

it('should create new field name value object', () => {
  const fieldName = FieldName.create('hello')
  expect(fieldName).toMatchInlineSnapshot(`
    FieldName {
      "props": {
        "value": "hello",
      },
    }
  `)
  expect(fieldName.value).toBe('hello')
})

it('should throw error if input is invlaue', () => {
  expect(() => FieldName.create('')).toThrowErrorMatchingInlineSnapshot(`
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
  expect(() => FieldName.create('thisisaverylongnameexceed20?')).toThrowErrorMatchingInlineSnapshot(`
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
