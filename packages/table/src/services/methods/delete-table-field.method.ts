import type { IDeleteTableFieldDTO } from "../../dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function deleteTableFieldMethod(this: TableService, dto: IDeleteTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const spec = table.$deleteField(dto)
  await this.repository.updateOneById(table, spec)

  return table
}
