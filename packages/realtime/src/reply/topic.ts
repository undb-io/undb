import { Option, type BaseEvent } from "@undb/domain"
import { RecordCreatedEvent, RecordDeletedEvent } from "@undb/table"
import { match, P } from "ts-pattern"

export type Topic = `tenant.${string}.${string}` | "*"

export const getTopic = (event: BaseEvent): Option<Topic> => {
  const topic = match(event)
    .returnType<Topic | null>()
    .with(P.instanceOf(RecordCreatedEvent), (e) => `tenant.${e.payload.tableId}.record.created`)
    .with(P.instanceOf(RecordDeletedEvent), (e) => `tenant.${e.payload.tableId}.record.deleted`)
    .otherwise(() => null)

  return Option(topic)
}
