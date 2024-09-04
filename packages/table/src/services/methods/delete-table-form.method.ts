import type { IDeleteTableFormDTO } from "../../modules/forms/dto/delete-form.dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function deleteTableFormMethod(this: TableService, dto: IDeleteTableFormDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const spec = table.$deleteForm(dto)

  await this.repository.updateOneById(table, spec)

  return table
}
