import { singleton } from "@undb/di"
import { WontImplementException, type Mapper } from "@undb/domain"
import { RecordDO, type IRecordDTO } from "@undb/table"

@singleton()
export class RecordMapper implements Mapper<RecordDO, any, IRecordDTO> {
  toDo(entity: any): RecordDO {
    throw new Error("Method not implemented.")
  }
  toEntity(domain: RecordDO) {
    return {
      id: domain.id.value,
      ...domain.values.toJSON(),
    }
  }
  toDTO(entity: any): IRecordDTO {
    throw new WontImplementException(RecordMapper.name + ".toDTO")
  }
}
