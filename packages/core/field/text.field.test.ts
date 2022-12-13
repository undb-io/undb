import { TextField } from './text.field'

it('should create new text field', () => {
  const field = TextField.create({
    name: 'hello',
    type: 'text',
    id: 'abc',
  })

  expect(field.unpack()).toMatchInlineSnapshot(`
    {
      "id": "abc",
      "name": "hello",
      "valueConstrains": {
        "required": undefined,
      },
    }
  `)

  expect(field.type).toBe('text')
})

it('should throw error if name is invalid', () => {
  const createField = () =>
    TextField.create({
      name: 'h',
      type: 'text',
      id: 'abc',
    })

  expect(createField).toThrowErrorMatchingInlineSnapshot(`
    "[
      {
        \\"code\\": \\"too_small\\",
        \\"minimum\\": 2,
        \\"type\\": \\"string\\",
        \\"inclusive\\": true,
        \\"exact\\": false,
        \\"message\\": \\"String must contain at least 2 character(s)\\",
        \\"path\\": []
      }
    ]"
  `)
})
