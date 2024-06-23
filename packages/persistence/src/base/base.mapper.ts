import { BaseFactory, type Base as BaseDo } from "@undb/base"
import type { IBaseDTO } from "@undb/base/src/dto/base.dto"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { Base } from "../tables"

@singleton()
export class BaseMapper implements Mapper<BaseDo, Base, IBaseDTO> {
  toDo(entity: Base): BaseDo {
    return BaseFactory.fromJSON(entity)
  }
  toEntity(domain: BaseDo): Base {
    return {
      id: domain.id.value,
      name: domain.name.value,
    }
  }
  toDTO(entity: Base): IBaseDTO {
    return {
      id: entity.id,
      name: entity.name,
    }
  }
}
