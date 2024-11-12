import { Some } from "@undb/domain"
import { withUniqueTable } from "../../../../specifications"
import type { IGetPivotDataDTO } from "../../dto"
import type { RecordsQueryService } from "../records.query-service"

export async function getPivotData(this: RecordsQueryService, dto: IGetPivotDataDTO): Promise<any> {
  const spec = withUniqueTable(dto).expect("Invalid unique table specification")

  const table = (await this.tableRepository.findOne(Some(spec))).expect("Table not found")

  const data = await this.repo.getPivotData(table, dto.viewId)
  return data
}
