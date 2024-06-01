import type { IUpdateTableFieldDTO } from "../../dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function updateTableFieldMethod(this: TableService, dto: IUpdateTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const spec = table.$updateField(dto.field)

  await this.repository.updateOneById(table, spec)

  return table
}
