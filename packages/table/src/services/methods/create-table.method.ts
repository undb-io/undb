import { withUniqueBase } from "@undb/base"
import { applyRules, Some } from "@undb/domain"
import type { ICreateTableDTO } from "../../dto"
import { TableNameShouldBeUnique } from "../../rules/table-name-should-be-unique.rule"
import { TableBaseIdSpecification } from "../../specifications"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createTableMethod(this: TableService, dto: ICreateTableDTO): Promise<TableDo> {
  const spec = withUniqueBase(dto).ok()
  const base = (await this.baseRepository.findOne(spec.unwrap())).expect("base not found")

  const baseIdSpec = new TableBaseIdSpecification(base.id.value)
  const baseTables = await this.repository.find(Some(baseIdSpec))

  const names = baseTables.map((table) => table.name.value).concat(dto.name)
  applyRules(new TableNameShouldBeUnique(names))

  const table = this.creator.create(dto)

  await this.repository.insert(table)

  return table
}
