import { DashboardFactory, type Dashboard as DashboardDo, type IDashboardDTO } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { Dashboard } from "../db"

@singleton()
export class DashboardMapper implements Mapper<DashboardDo, Dashboard, IDashboardDTO> {
  toDo(entity: Dashboard): DashboardDo {
    return DashboardFactory.fromJSON({
      id: entity.id,
      name: entity.name,
      baseId: entity.base_id,
      spaceId: entity.space_id,
    })
  }
  toEntity(domain: DashboardDo): Dashboard {
    return {
      id: domain.id.value,
      space_id: domain.spaceId,
      base_id: domain.baseId,
      name: domain.name.value,
    }
  }
  toDTO(entity: Dashboard): IDashboardDTO {
    return {
      id: entity.id,
      spaceId: entity.space_id,
      baseId: entity.base_id,
      name: entity.name,
    }
  }
}
