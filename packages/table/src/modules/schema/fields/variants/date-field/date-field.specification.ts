import { Ok, type Result } from "@undb/domain"
import { isEqual } from "date-fns"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { DateFieldValue } from "./date-field-value.vo"

export class DateEqual extends RecordComositeSpecification {
  constructor(
    readonly date: Date | null,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && this.date !== null && isEqual(v.value, this.date))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new DateFieldValue(this.date))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateEqual(this)
    return Ok(undefined)
  }
}
