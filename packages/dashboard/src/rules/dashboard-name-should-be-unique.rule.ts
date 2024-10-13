import { DomainRules, ExceptionBase } from "@undb/domain"

class DashboardNameShouldBeUniqueError extends ExceptionBase {
  code = "dashboard:DASHBOARD_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("dashboard name should be unique")
  }
}

export class DashboardNameShouldBeUnique extends DomainRules<DashboardNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new DashboardNameShouldBeUniqueError()

  override isBroken(): boolean {
    return this.names.length !== new Set(this.names).size
  }
}
