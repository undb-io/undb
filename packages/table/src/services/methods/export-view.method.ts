import { None } from "@undb/domain"
import { RecordDO, type IExportViewDTO } from "../../modules"
import { TableIdVo } from "../../table-id.vo"
import type { TableService } from "../table.service"

export async function exportViewMethod(this: TableService, tableId: string, dto: IExportViewDTO) {
  const table = (await this.repository.findOneById(new TableIdVo(tableId))).expect("Table not found")
  const view = table.views.getViewById(dto.viewId)

  const records = await this.recordQueryRepository.find(table, view, None)
  const recordDos = records.values.map((r) => RecordDO.fromJSON(table, r))
  const readable = recordDos.map((r) => r.toReadable(table))

  return { table, records: readable }
}
