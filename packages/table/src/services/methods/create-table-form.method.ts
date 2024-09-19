import type { FormVO } from "../../modules"
import type { ICreateTableFormDTO } from "../../modules/forms/dto/create-form.dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createTableFormMethod(
  this: TableService,
  dto: ICreateTableFormDTO,
): Promise<{ table: TableDo; form: FormVO }> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const { spec, form } = table.$createForm(dto)

  await this.repository.updateOneById(table, spec)

  return { table, form }
}
