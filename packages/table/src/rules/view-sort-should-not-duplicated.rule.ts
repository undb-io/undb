import { DomainRules, ExceptionBase } from "@undb/domain"
import type { IViewSort } from "../modules/views/view/view-sort/view-sort.vo"

class ViewSortShouldNotDuplicatedError extends ExceptionBase {
  code = "table:VIEW_SORT_SHOULD_NOT_DUPLICATED"

  constructor() {
    super("View sort should not duplicated")
  }
}

export class ViewSortShouldNotDuplicated extends DomainRules<ViewSortShouldNotDuplicatedError> {
  constructor(private readonly sort: IViewSort) {
    super()
  }

  override err = new ViewSortShouldNotDuplicatedError()

  override isBroken(): boolean {
    return this.sort.length !== new Set(this.sort.map((sort) => sort.fieldId)).size
  }
}
