import { DomainRules, ExceptionBase } from "@undb/domain"

class FormNameShouldBeUniqueError extends ExceptionBase {
  code = "table:FORM_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("form name should be unique within a table")
  }
}

export class FormNameShouldBeUnique extends DomainRules<FormNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new FormNameShouldBeUniqueError()

  override isBroken(): boolean {
    return new Set(this.names).size !== this.names.length
  }
}
