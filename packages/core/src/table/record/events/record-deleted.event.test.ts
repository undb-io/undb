import { createTestTable } from '../../fixtures'
import { createTestRecord } from '../fixtures'
import { RecordDeletedEvent } from './record-deleted.event'

describe('delete record', () => {
  test('delete record', () => {
    const table = createTestTable()
    const record = createTestRecord()
    const deleteEvent = RecordDeletedEvent.from(table, 'user1', record)
    const snapshotData = {
      payload: deleteEvent.payload,
      operatorId: deleteEvent.operatorId,
      name: deleteEvent.name,
      meta: {
        record: {
          id: deleteEvent.meta.record.id,
          createdBy: deleteEvent.meta.record.createdBy,
          createdByProfile: deleteEvent.meta.record.createdByProfile,
          updatedBy: deleteEvent.meta.record.updatedBy,
          updatedByProfile: deleteEvent.meta.record.updatedByProfile,
          autoIncrement: deleteEvent.meta.record.autoIncrement,
          tableId: deleteEvent.meta.record.tableId,
          values: deleteEvent.meta.record.values,
          displayValues: deleteEvent.meta.record.displayValues,
        },
      },
    }
    expect(snapshotData).toMatchSnapshot()
  })
})
