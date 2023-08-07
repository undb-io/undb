import { None, Some, type Option } from 'oxide.ts'
import { match } from 'ts-pattern'
import type { RecordCompositeSpecification, RecordEvents } from './record/index.js'
import {
  EVT_RECORD_BULK_CREATED,
  EVT_RECORD_BULK_DELETED,
  EVT_RECORD_BULK_UPDATED,
  EVT_RECORD_CREATED,
  EVT_RECORD_DELETED,
  EVT_RECORD_RESTORED,
  EVT_RECORD_UPDATED,
  RecordFactory,
  recordEvents,
} from './record/index.js'
import type { Table } from './table.js'

export const events = [...recordEvents] as const

export const refineRecordEvents = (
  table: Table,
  event: RecordEvents,
  ospec: Option<RecordCompositeSpecification>,
): Option<RecordEvents> => {
  if (ospec.isNone()) return Some(event)

  const schema = table.schema.toIdMap()
  const spec = ospec.unwrap()

  return match(event)
    .returnType<Option<typeof event>>()
    .with(
      { name: EVT_RECORD_CREATED },
      { name: EVT_RECORD_DELETED },
      { name: EVT_RECORD_UPDATED },
      { name: EVT_RECORD_RESTORED },
      (event) => {
        const record = RecordFactory.fromQuery(event.meta.record, schema).unwrap()
        return spec.isSatisfiedBy(record) ? Some(event) : None
      },
    )
    .with(
      { name: EVT_RECORD_BULK_CREATED },
      { name: EVT_RECORD_BULK_UPDATED },
      { name: EVT_RECORD_BULK_DELETED },
      (event) => {
        const records = RecordFactory.fromQueryRecords(Object.values(event.meta.records), schema)
        const matched = new Set(records.filter((r) => spec.isSatisfiedBy(r)).map((r) => r.id.value))
        if (matched.size === 0) return None

        return match(event)
          .with({ name: EVT_RECORD_BULK_CREATED }, (event) => {
            event.payload.records = event.payload.records.filter((r) => matched.has(r.id))
            return Some(event)
          })
          .with({ name: EVT_RECORD_BULK_UPDATED }, (event) => {
            event.payload.updates = event.payload.updates.filter((u) => matched.has(u.id))
            return Some(event)
          })
          .with({ name: EVT_RECORD_BULK_DELETED }, (event) => {
            event.payload.records = event.payload.records.filter((r) => matched.has(r.id))
            return Some(event)
          })
          .exhaustive()
      },
    )
    .exhaustive()
}
