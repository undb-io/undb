import { None, Option, Some } from "@undb/domain"
import { match } from "ts-pattern"
import type { Field, FieldValue } from "./field.type"
import {
  AutoIncrementFieldValue,
  CreatedAtFieldValue,
  IdFieldValue,
  NumberFieldValue,
  StringFieldValue,
  UpdatedAtFieldValue,
} from "./variants"

export class FieldValueFactory {
  static create(field: Field, value: any): Option<FieldValue> {
    const v = field.valueSchema.parse(value)
    return match(field.type)
      .with("number", () => Some(new NumberFieldValue(v as number)))
      .with("string", () => Some(new StringFieldValue(v as string)))
      .otherwise(() => None)
  }

  static fromJSON(field: Field, value: any): Option<FieldValue> {
    return match(field.type)
      .with("number", () => Some(new NumberFieldValue(value as number)))
      .with("string", () => Some(new StringFieldValue(value as string)))
      .with("autoIncrement", () => Some(new AutoIncrementFieldValue(value as number)))
      .with("id", () => Some(new IdFieldValue(value as string)))
      .with("createdAt", () => Some(new CreatedAtFieldValue(new Date(value))))
      .with("updatedAt", () => Some(new UpdatedAtFieldValue(new Date(value))))
      .exhaustive()
  }
}
