import type { ISpecVisitor } from "@undb/domain"
import type {
  ICreatedByFieldValueVisitor,
  INumberFieldValueVisitor,
  IReferenceFieldValueVisitor,
  IUpdatedAtFieldValueVisitor,
} from "../../schema"
import type { ICreatedAtFieldValueVisitor } from "../../schema/fields/variants/created-at-field"
import type { IIdFieldValueVisitor } from "../../schema/fields/variants/id-field"
import type { ISelectFieldValueVisitor } from "../../schema/fields/variants/select-field"
import type { IStringFieldValueVisitor } from "../../schema/fields/variants/string-field/string-field-value.visitor"

export type IRecordVisitor = IStringFieldValueVisitor &
  INumberFieldValueVisitor &
  IIdFieldValueVisitor &
  ICreatedAtFieldValueVisitor &
  ICreatedByFieldValueVisitor &
  IUpdatedAtFieldValueVisitor &
  IReferenceFieldValueVisitor &
  ISelectFieldValueVisitor &
  ISpecVisitor
