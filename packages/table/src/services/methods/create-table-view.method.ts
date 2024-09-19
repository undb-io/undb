import type { View } from "../../modules"
import type { ICreateTableViewDTO } from "../../modules/views/dto/create-view.dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createTableViewMethod(
  this: TableService,
  dto: ICreateTableViewDTO,
): Promise<{ table: TableDo; view: View }> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const { spec, view } = table.$createView(dto)

  await this.repository.updateOneById(table, spec)

  return { table, view }
}
