import { createTestTable } from './table.fixture'

test('createTestTable', () => {
  const table = createTestTable()

  expect(table).toMatchInlineSnapshot(`
    Table {
      "id": TableId {
        "props": {
          "value": "tableId",
        },
      },
      "name": TableName {
        "props": {
          "value": "name",
        },
      },
      "schema": TableSchema {
        "props": [
          TextField {
            "props": {
              "id": FieldId {
                "props": {
                  "value": "field1",
                },
              },
              "name": FieldName {
                "props": {
                  "value": "field1",
                },
              },
              "valueConstrains": FieldValueConstraints {
                "props": {
                  "required": undefined,
                },
              },
            },
          },
        ],
      },
      "views": Views {
        "props": [
          View {
            "props": {
              "displayType": "grid",
              "filter": undefined,
              "name": ViewName {
                "props": {
                  "value": "name",
                },
              },
            },
          },
        ],
      },
    }
  `)
})
