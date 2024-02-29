import { NestSearchOnRecordBulkCreatedEventHandler } from './search-on-record-bulk-created.event-handler.js'
import { NestSearchOnRecordBulkDeletedEventHandler } from './search-on-record-bulk-deleted.event-handler.js'
import { NestSearchOnRecordBulkUpdatedEventHandler } from './search-on-record-bulk-updated.event-handler.js'
import { NestSearchOnRecordCreatedEventHandler } from './search-on-record-created.event-handler.js'
import { NestSearchOnRecordDeletedEventHandler } from './search-on-record-deleted.event-handler.js'
import { NestSearchOnRecordUpdatedEventHandler } from './search-on-record-updated.event-handler.js'

export const events = [
  NestSearchOnRecordCreatedEventHandler,
  NestSearchOnRecordBulkCreatedEventHandler,
  NestSearchOnRecordUpdatedEventHandler,
  NestSearchOnRecordBulkUpdatedEventHandler,
  NestSearchOnRecordDeletedEventHandler,
  NestSearchOnRecordBulkDeletedEventHandler,
]
