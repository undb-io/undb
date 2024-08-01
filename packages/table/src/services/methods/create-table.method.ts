import { applyRules, Some } from "@undb/domain"
import type { ICreateTableDTO } from "../../dto"
import { TableNameShouldBeUnique } from "../../rules/table-name-should-be-unique.rule"
import { TableBaseIdSpecification } from "../../specifications"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createTableMethod(this: TableService, dto: ICreateTableDTO): Promise<TableDo> {
  const spec = new TableBaseIdSpecification(dto.baseId)
  const baseTables = await this.repository.find(Some(spec))

  const names = baseTables.map((table) => table.name.value).concat(dto.name)
  applyRules(new TableNameShouldBeUnique(names))

  const table = this.creator.create(dto)

  await this.repository.insert(table)

  return table
}
