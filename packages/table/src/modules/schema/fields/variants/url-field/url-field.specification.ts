import { Ok, type Result } from "@undb/domain"
import { isString } from "radash"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { UrlFieldValue } from "./url-field-value.vo"

export class UrlEqual extends RecordComositeSpecification {
  constructor(
    readonly value: string | null,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isString(v.value) && v.value == this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new UrlFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.urlEqual(this)
    return Ok(undefined)
  }
}
