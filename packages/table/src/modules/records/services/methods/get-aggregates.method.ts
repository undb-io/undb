import { None, Some } from "@undb/domain"
import { TableIdVo } from "../../../../table-id.vo"
import { ViewIdVo } from "../../../views"
import type { AggregateResult, IGetAggregatesDTO } from "../../dto"
import type { RecordsQueryService } from "../records.query-service"

export async function getAggregates(
  this: RecordsQueryService,
  dto: IGetAggregatesDTO,
): Promise<Record<string, AggregateResult>> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None

  return this.repo.aggregate(table, viewId)
}
