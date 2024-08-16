import { WithBaseSpaceId, type Base } from "@undb/base"
import { Some } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { TableBaseIdSpecification } from "../../specifications"
import type { TableService } from "../table.service"

export async function duplicateBaseMethod(this: TableService, base: Base, spaceId: ISpaceId) {
  const bases = await this.baseRepository.find(new WithBaseSpaceId(spaceId))
  const baseNames = bases.map((b) => b.name.value)

  const spec = base.$duplicate(baseNames)

  const { duplicatedBase } = spec
  await this.baseRepository.insert(duplicatedBase)

  const tables = await this.repository.find(Some(new TableBaseIdSpecification(base.id.value)))
  await this.duplicateTables(spaceId, duplicatedBase, tables)

  return duplicatedBase
}
