import { DomainRules, ExceptionBase } from "@undb/domain"

class TableNameShouldBeUniqueError extends ExceptionBase {
  code = "table:TABLE_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("table name should be unique within a base")
  }
}

export class TableNameShouldBeUnique extends DomainRules<TableNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new TableNameShouldBeUniqueError()

  override isBroken(): boolean {
    return new Set(this.names).size !== this.names.length
  }
}
