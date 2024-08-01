import type { ISpecVisitor } from "@undb/domain"
import type {
  ICheckboxFieldValueVisitor,
  ICreatedByFieldValueVisitor,
  IDateFieldValueVisitor,
  IJsonFieldValueVisitor,
  INumberFieldValueVisitor,
  IReferenceFieldValueVisitor,
  IUpdatedAtFieldValueVisitor,
  IUserFieldValueVisitor,
} from "../../schema"
import type { IAttachmentFieldValueVisitor } from "../../schema/fields/variants/attachment-field"
import type { ICreatedAtFieldValueVisitor } from "../../schema/fields/variants/created-at-field"
import type { IEmailFieldValueVisitor } from "../../schema/fields/variants/email-field"
import type { IIdFieldValueVisitor } from "../../schema/fields/variants/id-field"
import type { IRatingFieldValueVisitor } from "../../schema/fields/variants/rating-field"
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
  IRatingFieldValueVisitor &
  IEmailFieldValueVisitor &
  IAttachmentFieldValueVisitor &
  IDateFieldValueVisitor &
  IJsonFieldValueVisitor &
  ICheckboxFieldValueVisitor &
  IUserFieldValueVisitor &
  ISpecVisitor
