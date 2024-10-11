import { DomainRules, ExceptionBase } from "@undb/domain"

class ViewWidgetNameShouldBeUniqueError extends ExceptionBase {
  code = "table:VIEW_WIDGET_NAME_SHOULD_BE_UNIQUE"

  constructor() {
    super("view widget name should be unique within a view")
  }
}

export class ViewWidgetNameShouldBeUnique extends DomainRules<ViewWidgetNameShouldBeUniqueError> {
  constructor(private readonly names: string[]) {
    super()
  }

  override err = new ViewWidgetNameShouldBeUniqueError()

  override isBroken(): boolean {
    return new Set(this.names).size !== this.names.length
  }
}
