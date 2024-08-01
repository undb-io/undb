import { None, Some, type Option } from "@undb/domain"
import { match } from "ts-pattern"
import { type IRecordEvent } from "."
import { RecordDO, type RecordComositeSpecification } from "../.."
import type { TableDo } from "../../../table.do"

/**
 * Refine record events based on the given specification.
 *
 * @param table The table to refine the record event.
 * @param event The record event to refine.
 * @param spec The specification to refine the record event.
 * @returns {Option<IRecordEvent>} The refined record event.
 *  If the event is not satisfied by the specification, it will return None.
 */
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
      const record = RecordDO.fromJSON(table, event.meta.record)
      const isSatisfied = spec.unwrap().isSatisfiedBy(record)
      return isSatisfied ? Some(event) : None
    })
    .with({ name: "record.updated" }, (event) => {
      const record = RecordDO.fromJSON(table, event.meta.record)
      const isSatisfied = spec.unwrap().isSatisfiedBy(record)
      return isSatisfied ? Some(event) : None
    })
    .exhaustive()
}
