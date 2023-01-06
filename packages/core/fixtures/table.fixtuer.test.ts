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
          StringField {
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
            "type": "string",
          },
        ],
      },
      "views": Views {
        "props": [
          View {
            "props": {
              "calendar": undefined,
              "displayType": "grid",
              "fieldOptions": ViewFieldOptions {
                "props": Map {},
              },
              "fieldsOrder": undefined,
              "filter": undefined,
              "id": ViewId {
                "props": {
                  "value": "name",
                },
              },
              "kanban": undefined,
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
