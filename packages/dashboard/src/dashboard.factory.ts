import { and } from "@undb/domain"
import { Dashboard } from "./dashboard.do.js"
import type { ICreateDashboardDTO } from "./dto/create-dashboard.dto.js"
import type { IDashboardDTO } from "./dto/dashboard.dto.js"
import { DashboardCreatedEvent } from "./events/dashboard-created.event.js"
import type { IDashboardSpecification } from "./interface.js"
import { DashboardBaseIdSpecification } from "./specifications/dashboard-base-id.specification.js"
import { WithDashboardDescription } from "./specifications/dashboard-description.specification.js"
import { WithDashboardId } from "./specifications/dashboard-id.specification.js"
import { WithDashboardLayout } from "./specifications/dashboard-layout.specification.js"
import { WithDashboardName } from "./specifications/dashboard-name.specification.js"
import { WithDashboardSpaceId } from "./specifications/dashboard-space-id.specification.js"
import { WithDashboardWidgets } from "./specifications/dashboard-widget.specification.js"
import { DashboardId } from "./value-objects/dashboard-id.vo.js"

export class DashboardFactory {
  static new(...specs: IDashboardSpecification[]): Dashboard {
    return and(...specs)
      .unwrap()
      .mutate(Dashboard.empty())
      .unwrap()
  }

  static fromJSON(dto: IDashboardDTO): Dashboard {
    return this.new(
      WithDashboardId.fromString(dto.id),
      WithDashboardName.fromString(dto.name),
      new WithDashboardSpaceId(dto.spaceId),
      new DashboardBaseIdSpecification(dto.baseId),
      WithDashboardWidgets.from(dto.widgets || []),
      new WithDashboardLayout(dto.layout ?? {}),
      WithDashboardDescription.fromString(dto.description),
    )
  }

  static create(input: ICreateDashboardDTO): Dashboard {
    const dashboard = this.new(
      new WithDashboardId(DashboardId.fromOrCreate(input.id)),
      WithDashboardName.fromString(input.name),
      new WithDashboardSpaceId(input.spaceId),
      new DashboardBaseIdSpecification(input.baseId!),
      WithDashboardWidgets.from(input.widgets || []),
      WithDashboardLayout.create(input.widgets || [], input.layout),
      WithDashboardDescription.fromString(input.description),
    )

    // @ts-expect-error
    dashboard.addDomainEvent(new DashboardCreatedEvent({ dashboard: dashboard.toJSON() }))

    return dashboard
  }

  static createMany(dtos: ICreateDashboardDTO[]): Dashboard[] {
    return dtos.map((dto) => this.create(dto))
  }
}
