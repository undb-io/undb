import { Ok, type Result } from "@undb/domain"
import { isString } from "radash"
import { RecordComositeSpecification, RecordDO, type IRecordVisitor } from "../../../../records"
import type { FieldId } from "../../field-id.vo"
import type { IOptionId } from "../../option/option-id.vo"
import { StringFieldValue } from "../string-field"

export class SelectEqual extends RecordComositeSpecification {
  constructor(
    readonly value: IOptionId,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => isString(v.value) && v.value == this.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new StringFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}
