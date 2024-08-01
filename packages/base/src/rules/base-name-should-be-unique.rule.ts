import { DomainRules, ExceptionBase } from "@undb/domain"

class BaseNameShouldBeUniqueError extends ExceptionBase {
  code = "base:BASE_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("base name should be unique")
  }
}

export class BaseNameShouldBeUnique extends DomainRules<BaseNameShouldBeUniqueError> {
  constructor(private readonly hasBase: boolean) {
    super()
  }

  override err = new BaseNameShouldBeUniqueError()

  override isBroken(): boolean {
    return !!this.hasBase
  }
}
