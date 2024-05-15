import { None, Option, Some } from "@undb/domain"
import { match } from "ts-pattern"
import type { Field, FieldValue } from "./field.type"
import { NumberFieldValue, StringFieldValue } from "./variants"

export class FieldValueFactory {
  static create(field: Field, value: any): Option<FieldValue> {
    const v = field.valueSchema.parse(value)
    return match(field.type)
      .with("number", () => Some(new NumberFieldValue(v as number)))
      .with("string", () => Some(new StringFieldValue(v as string)))
      .otherwise(() => None)
  }
}
