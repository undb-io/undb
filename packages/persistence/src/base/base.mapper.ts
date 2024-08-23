import { BaseFactory, type Base as BaseDo, type IBaseDTO } from "@undb/base"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { Base } from "../db"

@singleton()
export class BaseMapper implements Mapper<BaseDo, Base, IBaseDTO> {
  toDo(entity: Base): BaseDo {
    return BaseFactory.fromJSON({
      id: entity.id,
      name: entity.name,
      spaceId: entity.space_id,
      option: {},
    })
  }
  toEntity(domain: BaseDo): Base {
    return {
      id: domain.id.value,
      space_id: domain.spaceId,
      name: domain.name.value,
    }
  }
  toDTO(entity: Base): IBaseDTO {
    return {
      id: entity.id,
      spaceId: entity.space_id,
      name: entity.name,
      option: {},
    }
  }
}
