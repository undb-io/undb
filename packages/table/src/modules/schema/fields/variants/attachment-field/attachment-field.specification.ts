import { Ok, type Result } from "@undb/domain"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { AttachmentFieldValue, type IAttachmentFieldValue } from "./attachment-field-value.vo"

export class AttachmentEqual extends RecordComositeSpecification {
  constructor(
    readonly value: IAttachmentFieldValue | null,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new AttachmentFieldValue(this.value))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.attachmentEqual(this)
    return Ok(undefined)
  }
}

export class AttachmentEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new AttachmentFieldValue([]))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.attachmentEmpty(this)
    return Ok(undefined)
  }
}
