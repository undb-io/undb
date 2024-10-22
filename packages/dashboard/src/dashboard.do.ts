import type { IBaseId } from "@undb/base"
import { AggregateRoot, and, andOptions, Some } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { TableDo } from "@undb/table"
import { getNextName } from "@undb/utils"
import { Option } from "oxide.ts"
import { DashboardFactory } from "./dashboard.factory.js"
import type { IAddDashboardWidgetDTO } from "./dto/add-dashboard-widget.dto.js"
import type { IDashboardDTO } from "./dto/dashboard.dto.js"
import type { IDuplicateDashboardWidgetDTO } from "./dto/duplicate-dashboard-widget.dto.js"
import type { IDuplicateDashboardDTO } from "./dto/duplicate-dashboard.dto.js"
import type { IRelayoutDashboardWidgetsDTO } from "./dto/relayout-dashboard-widgets.dto.js"
import type { IUpdateDashboardDTO } from "./dto/update-dashboard.dto.js"
import { DashboardUpdatedEvent } from "./events/dashboard-updated.event.js"
import type { IDashboardSpecification } from "./interface.js"
import { WithDashboardName } from "./specifications/dashboard-name.specification.js"
import { DuplicatedDashboardSpecification } from "./specifications/dashboard.specification.js"
import { WithDashboardDescription, type DashboardComositeSpecification } from "./specifications/index.js"
import { DashboardId, DashboardLayouts, DashboardWidgets, type DashboardName } from "./value-objects/index.js"

export class Dashboard extends AggregateRoot<any> {
  id!: DashboardId
  baseId!: IBaseId
  name!: DashboardName
  description?: string
  spaceId!: ISpaceId
  widgets!: DashboardWidgets
  layout!: DashboardLayouts

  static empty() {
    return new Dashboard()
  }

  public $update(schema: IUpdateDashboardDTO): Option<IDashboardSpecification> {
    const previous = this.toJSON()
    const specs: IDashboardSpecification[] = []

    if (schema.name) {
      specs.push(WithDashboardName.fromString(schema.name))
    }
    if (schema.description) {
      specs.push(WithDashboardDescription.fromString(schema.description))
    }

    const spec = and(...specs)
    if (spec.isSome()) {
      spec.unwrap().mutate(this)
    }

    const event = new DashboardUpdatedEvent({ previous, dashboard: this.toJSON() })
    this.addDomainEvent(event)

    return spec
  }

  public $duplicate(dto: IDuplicateDashboardDTO, dashboardNames: string[]): DuplicatedDashboardSpecification {
    const duplicatedDashboard = DashboardFactory.fromJSON({
      ...this.toJSON(),
      id: DashboardId.create().value,
      name: getNextName(dashboardNames, this.name.value),
    })

    return new DuplicatedDashboardSpecification(this, duplicatedDashboard)
  }

  $addWidget(table: TableDo, dto: IAddDashboardWidgetDTO): Option<DashboardComositeSpecification> {
    return and(this.widgets.$addWidget(table, dto.widget), this.layout.$addWidget(dto.widget.widget.id, dto.layout))
  }

  $duplicateWidget(table: TableDo, dto: IDuplicateDashboardWidgetDTO): Option<DashboardComositeSpecification> {
    return andOptions(
      this.widgets.$duplicateWidget(table, dto.widgetId),
      Option(this.layout.$addWidget(dto.widgetId, dto.layout)),
    )
  }

  $relayoutWidgets(dto: IRelayoutDashboardWidgetsDTO): Option<DashboardComositeSpecification> {
    const spec = this.layout.$relayoutWidgets(dto.layout)
    return Some(spec)
  }

  get tableIds(): string[] {
    return this.widgets.tableIds
  }

  $onFieldDeleted(tableId: string, fieldId: string): Option<DashboardComositeSpecification> {
    return this.widgets.$onFieldDeleted(tableId, fieldId)
  }

  $onTableDeleted(tableId: string): Option<DashboardComositeSpecification> {
    return this.widgets.$onTableDeleted(tableId)
  }

  public toJSON(): IDashboardDTO {
    return {
      id: this.id.value,
      baseId: this.baseId,
      spaceId: this.spaceId,
      name: this.name.value,
      description: this.description,
      widgets: this.widgets.value,
      layout: this.layout.value,
    }
  }
}
