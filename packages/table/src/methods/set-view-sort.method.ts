import { applyRules, type Option } from "@undb/domain"
import type { ISetViewSortDTO } from "../dto"
import { SetViewSortEvent } from "../events"
import { ViewSortShouldBeSortable } from "../rules/view-sort-should-be-sortable.rule"
import { ViewSortShouldNotDuplicated } from "../rules/view-sort-should-not-duplicated.rule"
import type { TableComositeSpecification } from "../specifications"
import type { TableDo } from "../table.do"

export function setViewSort(this: TableDo, dto: ISetViewSortDTO): Option<TableComositeSpecification> {
  applyRules(
    new ViewSortShouldBeSortable(this.schema.fieldMapById, dto.sort),
    new ViewSortShouldNotDuplicated(dto.sort),
  )

  const view = this.views.getViewById(dto.viewId)

  const spec = view.$setSortSpec(dto.sort)
  if (spec.isSome()) {
    spec.unwrap().mutate(this)

    const event = new SetViewSortEvent(
      {
        tableId: this.id.value,
        viewId: view.id.value,
        previous: spec.unwrap().previous.into(null) ?? null,
        sort: view.sort.into(null)?.toJSON() ?? null,
      },
      this.spaceId,
    )
    this.addDomainEvent(event)
  }

  return spec
}
