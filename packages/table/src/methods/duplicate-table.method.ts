import type { IDuplicateTableDTO } from "../dto/duplicate-table.dto"
import { getNextName } from "../modules"
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
    id: TableIdVo.create().value,
    name: getNextName(tableNames, this.name.value),
  })

  return new DuplicatedTableSpecification(this, duplicated)
}
