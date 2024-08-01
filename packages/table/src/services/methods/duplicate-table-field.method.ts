import type { IDuplicateTableFieldDTO } from "../../dto"
import { ReferenceField } from "../../modules/schema/fields/variants/reference-field/reference-field.vo"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function duplicateTableFieldMethod(this: TableService, dto: IDuplicateTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const [field, spec] = table.$duplicateField(dto)

  if (field.type === "reference") {
    const foreignTable = (await this.repository.findOneById(new TableIdVo(field.foreignTableId))).expect(
      "Not found foreign table",
    )

    const symmetricField = ReferenceField.createSymmetricField(table, foreignTable, field)

    const foreignSpec = foreignTable.$createFieldSpec(symmetricField)

    await this.repository.updateOneById(foreignTable, foreignSpec)
  }

  await this.repository.updateOneById(table, spec)

  return table
}
