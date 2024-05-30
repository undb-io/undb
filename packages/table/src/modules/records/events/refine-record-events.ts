import { None, Some, type Option } from "@undb/domain"
import { type IRecordEvent } from "."
import { RecordDO, type RecordComositeSpecification } from "../.."
import type { TableDo } from "../../../table.do"
import { match } from "ts-pattern"

export function refineRecordEvents(
  table: TableDo,
  event: IRecordEvent,
  spec: Option<RecordComositeSpecification>,
): Option<IRecordEvent> {
  if (spec.isNone()) {
    return Some(event)
  }

  return match(event)
    .returnType<Option<IRecordEvent>>()
    .with({ name: "record.deleted" }, (event) => {
      const record = RecordDO.fromJSON(table, event.meta.record)
      const isSatisfied = spec.unwrap().isSatisfiedBy(record)
      return isSatisfied ? Some(event) : None
    })
    .with({ name: "record.created" }, (event) => {
      const record = RecordDO.fromJSON(table, event.payload)
      const isSatisfied = spec.unwrap().isSatisfiedBy(record)
      return isSatisfied ? Some(event) : None
    })
    .exhaustive()
}
