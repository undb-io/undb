import { RecordFactory } from '../record.factory'
import { WithRecordId, WithRecordTableId } from '../specifications'

export const createTestRecord = () =>
  RecordFactory.create(WithRecordTableId.fromString('tableId').unwrap().and(WithRecordId.fromString('record'))).unwrap()
