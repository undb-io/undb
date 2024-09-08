import { DomainRules, ExceptionBase } from "@undb/domain"

class ViewNameShouldBeUniqueError extends ExceptionBase {
  code = "table:VIEW_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("view name should be unique within a table")
  }
}

export class ViewNameShouldBeUnique extends DomainRules<ViewNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new ViewNameShouldBeUniqueError()

  override isBroken(): boolean {
    return new Set(this.names).size !== this.names.length
  }
}
