import { getNextName } from "@undb/utils"
import type { IDuplicateTableDTO } from "../dto/duplicate-table.dto"
import { DuplicatedTableSpecification } from "../specifications"
import { TableIdVo } from "../table-id.vo"
import { TableCreator } from "../table.builder"
import { TableDo } from "../table.do"

export function duplicateTableMethod(
  this: TableDo,
  dto: IDuplicateTableDTO,
  tableNames: string[],
): DuplicatedTableSpecification {
  const duplicated = new TableCreator().fromJSON({
    ...this.toJSON(),
    id: dto.tableId ?? TableIdVo.create().value,
    baseId: dto.baseId ?? this.baseId,
    spaceId: dto.spaceId ?? this.spaceId,
    name: getNextName(tableNames, this.name.value),
  })

  return new DuplicatedTableSpecification(this, duplicated)
}
