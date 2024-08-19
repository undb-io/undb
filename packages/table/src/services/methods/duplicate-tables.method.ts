import type { Base } from "@undb/base"
import { Some } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { DuplicatedTableSpecification } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function duplicateTablesMethod(
  this: TableService,
  spaceId: ISpaceId,
  targetSpaceId: ISpaceId,
  base: Base,
  tables: TableDo[],
  includeData: boolean = false,
): Promise<TableDo[]> {
  const idsMap = new Map<string, string>()
  const specs: DuplicatedTableSpecification[] = []
  const duplicatedTables: TableDo[] = []

  for (const table of tables) {
    idsMap.set(table.id.value, TableIdVo.create().value)
  }

  for (const table of tables) {
    const spec = table.$duplicate(
      {
        tableId: idsMap.get(table.id.value)!,
        baseId: base.id.value,
        spaceId: targetSpaceId,
        includeData,
        isSameSpace: spaceId === targetSpaceId,
      },
      [],
    )
    specs.push(spec)

    const { duplicatedTable } = spec
    duplicatedTables.push(duplicatedTable)

    const referenceFields = duplicatedTable.schema.getReferenceFields()
    for (const field of referenceFields) {
      const newId = idsMap.get(field.foreignTableId)!
      field.foreignTableId = newId
    }
    // TODO: update & insert batch
    await this.repository.insert(duplicatedTable)
    await this.repository.updateOneById(duplicatedTable, Some(spec))
  }

  return duplicatedTables
}
