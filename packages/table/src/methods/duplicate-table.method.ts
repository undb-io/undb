import { getNextName } from "@undb/utils"
import type { IDuplicateTableDTO } from "../dto/duplicate-table.dto"
import { DuplicatedTableSpecification } from "../specifications"
import { TableIdVo } from "../table-id.vo"
import { TableDo } from "../table.do"
import { TableFactory } from "../table.factory"

export function duplicateTableMethod(
  this: TableDo,
  dto: IDuplicateTableDTO,
  tableNames: string[],
): DuplicatedTableSpecification {
  const duplicated = new TableFactory().fromJSON({
    ...this.toJSON(),
    id: dto.tableId ?? TableIdVo.create().value,
    baseId: dto.baseId ?? this.baseId,
    spaceId: dto.spaceId ?? this.spaceId,
    name: dto.name ?? getNextName(tableNames, this.name.value),
  })

  return new DuplicatedTableSpecification(this, duplicated, dto.includeData ?? false, dto.isSameSpace ?? true)
}
