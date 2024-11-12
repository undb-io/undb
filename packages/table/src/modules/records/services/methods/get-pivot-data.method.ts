import { Some } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { IGetPivotDataDTO, IGetPivotDataOutput } from "../../dto"
import type { RecordsQueryService } from "../records.query-service"

export async function getPivotData(this: RecordsQueryService, dto: IGetPivotDataDTO): Promise<IGetPivotDataOutput> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")

  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")
  const view = table.views.getViewByNameOrId(dto.viewName, dto.viewId)

  const data = await this.repo.getPivotData(table, view.id.value)
  return data
}
