import { DomainRules, ExceptionBase } from "@undb/domain"
import type { Schema } from "../schema.vo"

class FieldNameShouldBeUniqueError extends ExceptionBase {
  code = "table:FIELD_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("Field name should be unique")
  }
}

export class FieldNameShouldBeUnique extends DomainRules<FieldNameShouldBeUniqueError> {
  constructor(private readonly schema: Schema) {
    super()
  }

  override err = new FieldNameShouldBeUniqueError()

  override isBroken(): boolean {
    const names = this.schema.fields.map((field) => field.name.value)
    return new Set(names).size !== names.length
  }
}
