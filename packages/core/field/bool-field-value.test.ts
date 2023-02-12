import { BoolFieldValue } from './bool-field-value.js'

test('should create bool field value with true', () => {
  const value = new BoolFieldValue(true)
  expect(value).toMatchInlineSnapshot(`
    BoolFieldValue {
      "props": {
        "value": true,
      },
    }
  `)
})

test('should create bool field value with false', () => {
  const value = new BoolFieldValue(false)
  expect(value).toMatchInlineSnapshot(`
    BoolFieldValue {
      "props": {
        "value": false,
      },
    }
  `)
})

test('T', () => {
  const value = BoolFieldValue.T
  expect(value).toMatchInlineSnapshot(`
    BoolFieldValue {
      "props": {
        "value": true,
      },
    }
  `)
})

test('F', () => {
  const value = BoolFieldValue.F
  expect(value).toMatchInlineSnapshot(`
    BoolFieldValue {
      "props": {
        "value": false,
      },
    }
  `)
})
