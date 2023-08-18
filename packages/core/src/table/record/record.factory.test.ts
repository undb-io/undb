import { identity } from 'lodash-es'
import { mockDeep } from 'vitest-mock-extended'
import { ClsStore } from '../../cls/cls'
import { createTestTable } from '../fixtures'
import { WithTableSchema } from '../specifications'
import { RecordFactory } from './record.factory'
import {
  WithRecordCreatedAt,
  WithRecordCreatedBy,
  WithRecordId,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordUpdatedBy,
} from './specifications'

const user = 'usr1'
const date = new Date(2019, 2, 2)

describe('#temp', () => {
  test('should create temp record', () => {
    const ctx = mockDeep<ClsStore>({ t: identity })
    const table = createTestTable(WithTableSchema.from([{ id: 'fld1', name: 'string', type: 'string' }], ctx))
    const spec = WithRecordId.fromString('rec1')
      .and(WithRecordTableId.fromString('tbl1').unwrap())
      .and(WithRecordCreatedAt.fromDate(date))
      .and(WithRecordUpdatedAt.fromDate(date))
      .and(WithRecordCreatedBy.fromString(user))
      .and(WithRecordUpdatedBy.fromString(user))

    const record = RecordFactory.temp(table, { fld1: 'hello' }, user, spec)
    expect(record).toMatchInlineSnapshot(`
      Record {
        "autoIncrement": undefined,
        "createdAt": r {
          "props": {
            "value": 2019-03-02T00:00:00.000Z,
          },
        },
        "createdBy": "usr1",
        "createdByProfile": null,
        "displayValues": RecordDisplayValues {
          "props": {},
        },
        "id": RecordId {
          "props": {
            "value": "rec1",
          },
        },
        "tableId": TableId {
          "props": {
            "value": "tbl1",
          },
        },
        "updatedAt": r {
          "props": {
            "value": 2019-03-02T00:00:00.000Z,
          },
        },
        "updatedBy": "usr1",
        "updatedByProfile": null,
        "values": RecordValues {
          "props": Map {
            "fld1" => StringFieldValue {
              "props": {
                "value": "hello",
              },
            },
          },
        },
      }
    `)
  })
})
