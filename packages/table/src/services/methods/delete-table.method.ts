import type { IDeleteTableDTO } from "../../dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function deleteTableMethod(this: TableService, dto: IDeleteTableDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  await this.repository.deleteOneById(table)

  return table
}
