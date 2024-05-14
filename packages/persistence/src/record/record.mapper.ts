import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import type { IRecordDTO, RecordDO } from "@undb/table"

@singleton()
export class RecordMapper implements Mapper<RecordDO, any, IRecordDTO> {
  toDo(entity: any): RecordDO {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: RecordDO) {
    throw new Error("Method not implemented.")
  }
  toDTO(entity: any): IRecordDTO {
    const { id, ...rest } = entity
    return {
      id: entity.id,
      values: rest,
    }
  }
}
