import { None, Option, Some } from "@undb/domain"
import { objectify } from "radash"
import type { IUniqueTableDTO } from "../../../../dto"
import { withUniqueTable } from "../../../../specifications"
import { RecordDO, RecordIdVO } from "../../record"
import type { ITriggerRecordButtonDTO } from "../../record/dto/trigger-record-button.dto"
import type { RecordsService } from "../records.service"

export async function triggerRecordButtonMethod(
  this: RecordsService,
  t: IUniqueTableDTO,
  dto: ITriggerRecordButtonDTO,
): Promise<Option<RecordDO>> {
  const ts = withUniqueTable(t).unwrap()
  const table = (await this.tableRepository.findOne(Some(ts))).expect("Table not found")

  const field = table.schema.getFieldByIdOrName(dto.field).expect("Field not found")
  if (field.type !== "button") {
    throw new Error("Field is not a button")
  }

  const option = field.option.into(undefined)
  if (!option) return None
  const action = option.action
  if (!action.values.length) return None

  const record = (await this.repo.findOneById(table, new RecordIdVO(dto.recordId))).expect(
    "Record not found: " + dto.recordId,
  )

  const disabled = field.getIsDisabled(table, record)
  if (disabled) return None

  const values = objectify(
    action.values,
    (v) => v.field!,
    (v) => v.value ?? null,
  )
  const spec = record.update(table, values)
  await this.repo.updateOneById(table, record, spec)

  return Some(record)
}
