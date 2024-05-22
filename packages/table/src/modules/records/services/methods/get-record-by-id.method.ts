import { Option } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import type { IGetRecordByIdDTO } from "../../dto"
import { RecordIdVO, type IRecordDTO } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function getRecordById(this: RecordsQueryService, dto: IGetRecordByIdDTO): Promise<Option<IRecordDTO>> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")

  return this.repo.findOneById(table, new RecordIdVO(dto.id))
}
