import { DomainRules, ExceptionBase } from "@undb/domain"

class BaseNameShouldBeUniqueError extends ExceptionBase {
  code = "base:BASE_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("base name should be unique")
  }
}

export class BaseNameShouldBeUnique extends DomainRules<BaseNameShouldBeUniqueError> {
  constructor(private readonly hasBase: boolean | string[]) {
    super()
  }

  override err = new BaseNameShouldBeUniqueError()

  override isBroken(): boolean {
    if (Array.isArray(this.hasBase)) {
      return this.hasBase.length !== new Set(this.hasBase).size
    }

    return !!this.hasBase
  }
}
