import type { ICreateTableFormDTO } from "../../modules/forms/dto/create-form.dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createTableFormMethod(this: TableService, dto: ICreateTableFormDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const spec = table.$createForm(dto)

  await this.repository.updateOneById(table, spec)

  return table
}
