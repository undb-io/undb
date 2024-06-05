import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { RecordDO, type IRecordDTO, type IRecordValues } from "@undb/table"
import type { IRecordDisplayValues } from "@undb/table/src/modules/records/record/record-display-values.vo"
import { getRawFieldName, isDisplayerFieldName } from "./record-display-field"

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
    const id = entity.id
    const values: IRecordValues = {}
    const displayValues: IRecordDisplayValues = {}
    for (const [key, value] of Object.entries(entity)) {
      if (key === "id") continue

      if (isDisplayerFieldName(key)) {
        displayValues[getRawFieldName(key)] = value
        continue
      }

      values[key] = value
    }

    return {
      id,
      values,
      displayValues,
    }
  }
}
