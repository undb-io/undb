import { None, Option, Some } from "@undb/domain"
import { mapKeys } from "radash"
import { FieldIdVo, type RecordComositeSpecification } from "../../.."
import { withUniqueTable } from "../../../../specifications/table-name.specification"
import { getSpec } from "../../../schema/fields/condition"
import type { AggregateResult, IGetAggregatesDTO } from "../../dto"
import type { QueryArgs } from "../../record/record.repository"
import type { RecordsQueryService } from "../records.query-service"

export async function getAggregates(
  this: RecordsQueryService,
  dto: IGetAggregatesDTO,
): Promise<Record<string, AggregateResult>> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")
  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const view = table.views.getViewByNameOrId(dto.viewName, dto.viewId)
  const viewId = Some(view.id)
  const aggregate = dto.aggregate

  let args: QueryArgs = {
    select: dto.select ? Some(dto.select) : None,
    filter: None,
    pagination: None,
    ignoreView: dto.ignoreView,
  }
  if (dto.condition) {
    args.filter = getSpec(table.schema, dto.condition) as Option<RecordComositeSpecification>
  }

  const result = await this.repo.aggregate(table, viewId, Option(aggregate), Some(args))
  if (dto.isReadable) {
    return mapKeys(
      result,
      (fieldId) => table.schema.getFieldById(new FieldIdVo(fieldId)).expect("Field not found").name.value,
    )
  }
  return result
}
