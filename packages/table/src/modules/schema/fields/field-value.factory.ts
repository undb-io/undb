import { None, Option, Some } from "@undb/domain"
import { match } from "ts-pattern"
import type { JsonValue } from "type-fest"
import type { Field, FieldValue, MutableFieldValue } from "./field.type"
import type { IOptionId } from "./option/option-id.vo"
import {
  AutoIncrementFieldValue,
  CreatedAtFieldValue,
  DateFieldValue,
  IdFieldValue,
  JsonFieldValue,
  NumberFieldValue,
  ReferenceFieldValue,
  RollupFieldValue,
  StringFieldValue,
  UpdatedAtFieldValue,
  UpdatedByFieldValue,
} from "./variants"
import { AttachmentFieldValue, type IAttachmentFieldValue } from "./variants/attachment-field"
import { CreatedByFieldValue } from "./variants/created-by-field"
import { EmailFieldValue } from "./variants/email-field"
import { RatingFieldValue } from "./variants/rating-field"
import { SelectFieldValue } from "./variants/select-field"

export class FieldValueFactory {
  static create(field: Field, value: any): Option<MutableFieldValue> {
    return match(field)
      .with({ type: "number" }, (field) => Some(new NumberFieldValue(field.valueSchema.parse(value))))
      .with({ type: "rating" }, (field) => Some(new RatingFieldValue(field.valueSchema.parse(value))))
      .with({ type: "string" }, (field) => Some(new StringFieldValue(field.valueSchema.parse(value))))
      .with({ type: "select" }, (field) => Some(new SelectFieldValue(field.valueSchema.parse(value))))
      .with({ type: "reference" }, (field) => Some(new ReferenceFieldValue(field.valueSchema.parse(value))))
      .with({ type: "email" }, (field) => Some(new EmailFieldValue(field.valueSchema.parse(value))))
      .with({ type: "attachment" }, (field) => Some(new AttachmentFieldValue(field.valueSchema.parse(value))))
      .with({ type: "date" }, (field) => Some(new DateFieldValue(field.valueSchema.parse(value))))
      .with({ type: "json" }, (field) => Some(new JsonFieldValue(field.valueSchema.parse(value))))
      .otherwise(() => None)
  }

  static fromJSON(field: Field, value: any): Option<FieldValue> {
    return match(field.type)
      .with("number", () => Some(new NumberFieldValue(value as number)))
      .with("rating", () => Some(new RatingFieldValue(value as number)))
      .with("string", () => Some(new StringFieldValue(value as string)))
      .with("autoIncrement", () => Some(new AutoIncrementFieldValue(value as number)))
      .with("id", () => Some(new IdFieldValue(value as string)))
      .with("createdAt", () => Some(new CreatedAtFieldValue(new Date(value))))
      .with("createdBy", () => Some(new CreatedByFieldValue(value as string)))
      .with("updatedAt", () => Some(new UpdatedAtFieldValue(new Date(value))))
      .with("updatedBy", () => Some(new UpdatedByFieldValue(value as string)))
      .with("reference", () => Some(new ReferenceFieldValue(value as string[])))
      .with("rollup", () => Some(new RollupFieldValue(value as number | Date)))
      .with("select", () => Some(new SelectFieldValue(value as IOptionId)))
      .with("email", () => Some(new EmailFieldValue(value as string)))
      .with("attachment", () => Some(new AttachmentFieldValue(value as IAttachmentFieldValue)))
      .with("date", () => Some(new DateFieldValue(value as Date)))
      .with("json", () => Some(new JsonFieldValue(value as JsonValue)))
      .exhaustive()
  }
}
