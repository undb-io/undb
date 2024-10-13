import { AggregateRoot, and } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { getNextName } from "@undb/utils"
import type { Option } from "oxide.ts"
import { DashboardFactory } from "./dashboard.factory.js"
import type { IDashboardDTO } from "./dto/dashboard.dto.js"
import type { IDuplicateDashboardDTO } from "./dto/duplicate-dashboard.dto.js"
import type { IUpdateDashboardDTO } from "./dto/update-dashboard.dto.js"
import { DashboardUpdatedEvent } from "./events/dashboard-updated.event.js"
import type { IDashboardSpecification } from "./interface.js"
import { WithDashboardName } from "./specifications/dashboard-name.specification.js"
import { DuplicatedDashboardSpecification } from "./specifications/dashboard.specification.js"
import { DashboardId, type DashboardName } from "./value-objects/index.js"

export class Dashboard extends AggregateRoot<any> {
  id!: DashboardId
  name!: DashboardName
  spaceId!: ISpaceId

  static empty() {
    return new Dashboard()
  }

  public $update(schema: IUpdateDashboardDTO): Option<IDashboardSpecification> {
    const previous = this.toJSON()
    const specs: IDashboardSpecification[] = []

    if (schema.name) {
      specs.push(WithDashboardName.fromString(schema.name))
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
      spaceId: dto.spaceId ?? this.spaceId,
      name: dto.name ?? getNextName(dashboardNames, this.name.value),
    })

    return new DuplicatedDashboardSpecification(this, duplicatedDashboard)
  }

  public toJSON(): IDashboardDTO {
    return {
      id: this.id.value,
      spaceId: this.spaceId,
      name: this.name.value,
    }
  }
}
