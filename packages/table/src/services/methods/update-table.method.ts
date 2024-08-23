import { applyRules, Some } from "@undb/domain"
import type { IUpdateTableDTO } from "../../dto"
import { TableNameShouldBeUnique } from "../../rules/table-name-should-be-unique.rule"
import { TableBaseIdSpecification } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function updateTableMethod(this: TableService, dto: IUpdateTableDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.id))).unwrap()

  const qs = new TableBaseIdSpecification(table.baseId)
  const baseTables = await this.repository.find(Some(qs))

  const names = baseTables.map((table) => table.name.value).concat(dto.name)
  applyRules(new TableNameShouldBeUnique(names))

  const spec = table.$update(dto)

  await this.repository.updateOneById(table, spec)

  return table
}
