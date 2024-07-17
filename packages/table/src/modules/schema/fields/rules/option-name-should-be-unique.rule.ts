import { DomainRules, ExceptionBase } from "@undb/domain"

class OptionNameShouldBeUniqueError extends ExceptionBase {
  code = "table:OPTION_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("option name should be unique within a field")
  }
}

export class OptionNameShouldBeUnique extends DomainRules<OptionNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new OptionNameShouldBeUniqueError()

  override isBroken(): boolean {
    return new Set(this.names).size !== this.names.length
  }
}
