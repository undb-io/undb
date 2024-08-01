import type { TableDo } from "../../table.do"
import type { IRecordDTO } from "./record/dto"
import { RecordDO } from "./record/record.do"

export const recordToReadable = (table: TableDo, dto: IRecordDTO) => {
  return RecordDO.fromJSON(table, dto).toReadable(table)
}

export const recordsToReadable = (table: TableDo, dtos: IRecordDTO[]) => {
  return dtos.map((dto) => recordToReadable(table, dto))
}
