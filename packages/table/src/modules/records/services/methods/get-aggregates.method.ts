import { None, Option, Some } from "@undb/domain"
import type { RecordComositeSpecification } from "../../.."
import { TableIdVo } from "../../../../table-id.vo"
import { getSpec } from "../../../schema/fields/condition"
import { ViewIdVo } from "../../../views"
import type { AggregateResult, IGetAggregatesDTO } from "../../dto"
import type { QueryArgs } from "../../record/record.repository"
import type { RecordsQueryService } from "../records.query-service"

export async function getAggregates(
  this: RecordsQueryService,
  dto: IGetAggregatesDTO,
): Promise<Record<string, AggregateResult>> {
  const tableId = new TableIdVo(dto.tableId)
  const table = (await this.tableRepository.findOneById(tableId)).expect("Table not found")
  const viewId = dto.viewId ? Some(new ViewIdVo(dto.viewId)) : None
  const aggregate = dto.aggregate

  let args: QueryArgs = {
    select: None,
    filter: None,
    pagination: None,
  }
  if (dto.condition) {
    args.filter = getSpec(table.schema, dto.condition) as Option<RecordComositeSpecification>
  }

  return this.repo.aggregate(table, viewId, Option(aggregate), Some(args))
}
