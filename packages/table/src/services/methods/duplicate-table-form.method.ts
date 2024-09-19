import type { FormVO } from "../../modules"
import type { IDuplicateTableFormDTO } from "../../modules/forms/dto/duplicate-form.dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function duplicateTableFormMethod(
  this: TableService,
  dto: IDuplicateTableFormDTO,
): Promise<{ table: TableDo; form: FormVO }> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const { spec, form } = table.$duplicateForm(dto)

  await this.repository.updateOneById(table, spec)

  return { table, form }
}
