import { DashboardFactory, type Dashboard as DashboardDo, type IDashboardDTO } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { Dashboard } from "../db"
import { json } from "../qb.util"

@singleton()
export class DashboardMapper implements Mapper<DashboardDo, Dashboard, IDashboardDTO> {
  toDo(entity: Dashboard): DashboardDo {
    return DashboardFactory.fromJSON({
      id: entity.id,
      name: entity.name,
      baseId: entity.base_id,
      spaceId: entity.space_id,
      widgets: entity.widgets ?? [],
      layout: entity.layout,
      description: entity.description ?? undefined,
    })
  }
  toEntity(domain: DashboardDo): Dashboard {
    return {
      id: domain.id.value,
      space_id: domain.spaceId,
      base_id: domain.baseId,
      name: domain.name.value,
      description: domain.description ?? null,
      widgets: domain.widgets.value ? json(domain.widgets.value) : null,
      layout: domain.layout.value ? json(domain.layout.value) : null,
    }
  }
  toDTO(entity: Dashboard): IDashboardDTO {
    return {
      id: entity.id,
      spaceId: entity.space_id,
      baseId: entity.base_id,
      name: entity.name,
      description: entity.description ?? undefined,
      widgets: entity.widgets ?? [],
      layout: entity.layout ?? {},
    }
  }
}
