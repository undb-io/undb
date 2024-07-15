import type { IDeleteTableFieldDTO } from "../../dto"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function deleteTableFieldMethod(this: TableService, dto: IDeleteTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const [field, spec] = table.$deleteField(dto)
  await this.repository.updateOneById(table, spec)

  if (field.type === "reference" && field.symmetricFieldId) {
    const foreignTable = (await this.repository.findOneById(new TableIdVo(field.foreignTableId))).expect(
      "Not found foreign table",
    )
    const [, foreignSpec] = foreignTable.$deleteField({ id: field.symmetricFieldId })
    await this.repository.updateOneById(foreignTable, foreignSpec)
  }

  return table
}
