import { TableIdVo } from "../../../../table-id.vo"
import type { ICountRecordsDTO } from "../../dto"
import { buildCountQuery } from "../../record"
import type { RecordsQueryService } from "../records.query-service"

export async function countRecords(this: RecordsQueryService, dto: ICountRecordsDTO): Promise<number> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")

  const query = buildCountQuery(table, dto)

  return this.repo.countWhere(table, undefined, query)
}
