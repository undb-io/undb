import type { ISpecVisitor } from "@undb/domain"

import type { IAttachmentFieldValueVisitor } from "../../schema/fields/variants/attachment-field"
import type { ICheckboxFieldValueVisitor } from "../../schema/fields/variants/checkbox-field/checkbox-field-value.visitor"
import type { ICreatedAtFieldValueVisitor } from "../../schema/fields/variants/created-at-field"
import type { ICreatedByFieldValueVisitor } from "../../schema/fields/variants/created-by-field/created-by-field-value.visitor"
import type { ICurrencyFieldValueVisitor } from "../../schema/fields/variants/currency-field"
import type { IDateFieldValueVisitor } from "../../schema/fields/variants/date-field/date-field-value.visitor"
import type { IDateRangeFieldValueVisitor } from "../../schema/fields/variants/date-range-field/date-range-field-value.visitor"
import type { IDurationFieldValueVisitor } from "../../schema/fields/variants/duration-field/duration-field-value.visitor"
import type { IEmailFieldValueVisitor } from "../../schema/fields/variants/email-field"
import type { IFormulaFieldValueVisitor } from "../../schema/fields/variants/formula-field/formula-field-value.visitor"
import type { IIdFieldValueVisitor } from "../../schema/fields/variants/id-field"
import type { IJsonFieldValueVisitor } from "../../schema/fields/variants/json-field/json-field-value.visitor"
import type { ILongTextFieldValueVisitor } from "../../schema/fields/variants/long-text-field/long-text-field-value.visitor"
import type { INumberFieldValueVisitor } from "../../schema/fields/variants/number-field"
import type { IPercentageFieldValueVisitor } from "../../schema/fields/variants/percentage-field/percentage-field-value.visitor"
import type { IRatingFieldValueVisitor } from "../../schema/fields/variants/rating-field"
import type { IReferenceFieldValueVisitor } from "../../schema/fields/variants/reference-field/reference-field-value.visitor"
import type { ISelectFieldValueVisitor } from "../../schema/fields/variants/select-field"
import type { IStringFieldValueVisitor } from "../../schema/fields/variants/string-field/string-field-value.visitor"
import type { IUpdatedAtFieldValueVisitor } from "../../schema/fields/variants/updated-at-field/updated-at-field-value.visitor"
import type { IUrlFieldValueVisitor } from "../../schema/fields/variants/url-field/url-field-value.visitor"
import type { IUserFieldValueVisitor } from "../../schema/fields/variants/user-field/user-field-value.visitor"

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
  IDateRangeFieldValueVisitor &
  ISpecVisitor
