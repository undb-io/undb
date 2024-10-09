import { DomainRules, ExceptionBase } from "@undb/domain"
import type { Schema } from "../schema.vo"

class FieldIdShouldBeUniqueError extends ExceptionBase {
  code = "table:FIELD_ID_SHOULD_BE_UNIQUE"

  constructor() {
    super("Field id should be unique")
  }
}

export class FieldIdShouldBeUnique extends DomainRules<FieldIdShouldBeUniqueError> {
  constructor(private readonly schema: Schema) {
    super()
  }

  override err = new FieldIdShouldBeUniqueError()

  override isBroken(): boolean {
    const ids = this.schema.fields.map((field) => field.id.value)
    return new Set(ids).size !== ids.length
  }
}
