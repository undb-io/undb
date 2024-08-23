import { BaseNameShouldBeUnique, WithBaseSpaceId, type Base, type IDuplicateBaseDTO } from "@undb/base"
import { and, applyRules } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { TableBaseIdSpecification, TableSpaceIdSpecification } from "../../specifications"
import type { TableService } from "../table.service"

export async function duplicateBaseMethod(
  this: TableService,
  base: Base,
  spaceId: ISpaceId,
  targetSpaceId: ISpaceId,
  dto: IDuplicateBaseDTO,
) {
  const bases = await this.baseRepository.find(new WithBaseSpaceId(targetSpaceId))
  const baseNames = bases.map((b) => b.name.value)

  const spec = base.$duplicate({ ...dto, spaceId: targetSpaceId }, baseNames)

  const { duplicatedBase } = spec

  applyRules(new BaseNameShouldBeUnique(baseNames.concat(duplicatedBase.name.value)))

  await this.baseRepository.insert(duplicatedBase)

  const tableSpec = and(new TableBaseIdSpecification(base.id.value), new TableSpaceIdSpecification(spaceId))
  const tables = await this.repository.find(tableSpec, true)
  await this.duplicateTables(spaceId, targetSpaceId, duplicatedBase, tables, dto.includeData)

  return duplicatedBase
}
