import { CompositeSpecification, Not } from "@undb/domain"
import type { FieldId } from "../../schema/fields/field-id.vo"
import type { IRecordVisitor } from "./record-visitor.interface"
import type { RecordDO } from "./record.do"

export abstract class RecordComositeSpecification extends CompositeSpecification<RecordDO, IRecordVisitor> {
  constructor(public readonly fieldId: FieldId) {
    super()
  }
}

export type INotRecordComositeSpecification = Not<RecordDO, IRecordVisitor>
export type IRecordComositeSpecification = CompositeSpecification<RecordDO, IRecordVisitor>
