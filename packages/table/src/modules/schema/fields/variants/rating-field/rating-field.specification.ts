import { Ok, type Result } from "@undb/domain"
import { isNumber } from "radash"
import { type FieldId, type IRecordVisitor } from "../../../.."
import type { RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import { RatingFieldValue } from "./rating-field-value.vo"

export class RatingEqual extends RecordComositeSpecification {
  constructor(
    readonly value: number,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isNumber(v.value) && v.value == this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new RatingFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.ratingEqual(this)
    return Ok(undefined)
  }
}
