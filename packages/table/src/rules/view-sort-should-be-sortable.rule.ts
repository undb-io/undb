import { DomainRules, ExceptionBase } from "@undb/domain"
import type { SchemaIdMap } from "../modules/schema/schema.type"
import type { IViewSort } from "../modules/views/view/view-sort/view-sort.vo"

class ViewSortShouldBeSortableError extends ExceptionBase {
  code = "table:VIEW_SORT_SHOULD_BE_SORTABLE"

  constructor() {
    super("View sort should be sortable")
  }
}

export class ViewSortShouldBeSortable extends DomainRules<ViewSortShouldBeSortableError> {
  constructor(
    private readonly schema: SchemaIdMap,
    private readonly sort: IViewSort,
  ) {
    super()
  }

  override err = new ViewSortShouldBeSortableError()

  override isBroken(): boolean {
    return !!this.sort.length && !this.sort.some((sort) => this.schema.get(sort.fieldId)?.sortable)
  }
}
