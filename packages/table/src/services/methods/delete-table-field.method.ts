import { Option, Some } from "@undb/domain"
import type { IDeleteTableFieldDTO } from "../../dto"
import type { Field } from "../../modules"
import { TableComositeSpecification, WithForeignRollupFieldSpec } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

async function deleteOtherFields(
  this: TableService,
  table: TableDo,
  field: Field,
): Promise<{ table: TableDo; spec: Option<TableComositeSpecification> }[]> {
  const results: { table: TableDo; spec: Option<TableComositeSpecification> }[] = []

  if (field.type === "reference") {
    const rollupFields = field.getRollupFields(table.schema.fields)
    for (const rollupField of rollupFields) {
      const [, spec] = table.$deleteField({ id: rollupField.id.value })
      results.push({ table, spec })
    }
  } else {
    const spec = new WithForeignRollupFieldSpec(field.id.value)
    const foreignTables = await this.repository.find(Some(spec))
    for (const foreignTable of foreignTables) {
      const rollupFields = foreignTable.schema.getRollupFields(field.id.value)
      for (const rollupField of rollupFields) {
        const [, spec] = foreignTable.$deleteField({ id: rollupField.id.value })
        results.push({ table: foreignTable, spec })
      }
    }
  }

  return results
}

export async function deleteTableFieldMethod(this: TableService, dto: IDeleteTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const updates: { table: TableDo; spec: Option<TableComositeSpecification> }[] = []
  const [field, spec] = table.$deleteField(dto)

  updates.push({ table, spec })
  updates.push(...(await deleteOtherFields.call(this, table, field)))

  if (field.type === "reference" && field.symmetricFieldId) {
    const foreignTable = (await this.repository.findOneById(new TableIdVo(field.foreignTableId))).expect(
      "Not found foreign table",
    )
    const [symmetricField, foreignSpec] = foreignTable.$deleteField({ id: field.symmetricFieldId })
    updates.push({ table: foreignTable, spec: foreignSpec })
    updates.push(...(await deleteOtherFields.call(this, foreignTable, symmetricField)))
  }

  await this.repository.bulkUpdate(updates)

  return table
}
