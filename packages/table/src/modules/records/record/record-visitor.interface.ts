import type { ISpecVisitor } from "@undb/domain"
import type {
  ICheckboxFieldValueVisitor,
  ICreatedByFieldValueVisitor,
  IDateFieldValueVisitor,
  IJsonFieldValueVisitor,
  ILongTextFieldValueVisitor,
  INumberFieldValueVisitor,
  IPercentageFieldValueVisitor,
  IReferenceFieldValueVisitor,
  IUpdatedAtFieldValueVisitor,
  IUrlFieldValueVisitor,
  IUserFieldValueVisitor,
} from "../../schema"
import type { IAttachmentFieldValueVisitor } from "../../schema/fields/variants/attachment-field"
import type { ICreatedAtFieldValueVisitor } from "../../schema/fields/variants/created-at-field"
import type { ICurrencyFieldValueVisitor } from "../../schema/fields/variants/currency-field"
import type { IDurationFieldValueVisitor } from "../../schema/fields/variants/duration-field/duration-field-value.visitor"
import type { IEmailFieldValueVisitor } from "../../schema/fields/variants/email-field"
import type { IFormulaFieldValueVisitor } from "../../schema/fields/variants/formula-field/formula-field-value.visitor"
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
  IUrlFieldValueVisitor &
  IAttachmentFieldValueVisitor &
  IDateFieldValueVisitor &
  IJsonFieldValueVisitor &
  ICheckboxFieldValueVisitor &
  IUserFieldValueVisitor &
  ILongTextFieldValueVisitor &
  ICurrencyFieldValueVisitor &
  IDurationFieldValueVisitor &
  IPercentageFieldValueVisitor &
  IFormulaFieldValueVisitor &
  ISpecVisitor
