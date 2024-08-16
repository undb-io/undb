import { applyRules, Some } from "@undb/domain"
import type { IDuplicateTableDTO } from "../../dto"
import { ReferenceField } from "../../modules"
import { TableNameShouldBeUnique } from "../../rules/table-name-should-be-unique.rule"
import { TableBaseIdSpecification } from "../../specifications/table-base-id.specification"
import { WithUpdatedFieldSpecification } from "../../specifications/table-schema.specification"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function duplicateTableMethod(this: TableService, dto: IDuplicateTableDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")
  const tables = await this.repository.find(Some(new TableBaseIdSpecification(table.baseId)))

  const tableNames = tables.map((t) => t.name.value)
  const spec = table.$duplicate({ ...dto, tableId: TableIdVo.create().value }, tableNames)

  const { duplicatedTable } = spec

  applyRules(new TableNameShouldBeUnique(tableNames.concat(duplicatedTable.name.value)))

  await this.repository.insert(spec.duplicatedTable)
  await this.repository.updateOneById(spec.duplicatedTable, Some(spec))

  const referenceFields = duplicatedTable.schema.fields.filter((f) => f.type === "reference")
  for (const referenceField of referenceFields) {
    const foreignTable = (await this.repository.findOneById(new TableIdVo(referenceField.foreignTableId))).expect(
      "Not found foreign table",
    )

    const symmetricField = ReferenceField.createSymmetricField(duplicatedTable, foreignTable, referenceField)
    const foreignSpec = foreignTable.$createFieldSpec(symmetricField)
    const spec = new WithUpdatedFieldSpecification(referenceField, referenceField)

    await this.repository.updateOneById(duplicatedTable, Some(spec))
    await this.repository.updateOneById(foreignTable, foreignSpec)
  }

  return table
}
