import { DomainRules, ExceptionBase } from "@undb/domain"

class DashboardIdShouldBeUniqueError extends ExceptionBase {
  code = "dashboard:DASHBOARD_ID_SHOULD_BE_UNIQUE"

  constructor() {
    super("dashboard id should be unique")
  }
}

export class DashboardIdShouldBeUnique extends DomainRules<DashboardIdShouldBeUniqueError> {
  constructor(private readonly ids: string[]) {
    super()
  }

  override err = new DashboardIdShouldBeUniqueError()

  override isBroken(): boolean {
    return this.ids.length !== new Set(this.ids).size
  }
}
