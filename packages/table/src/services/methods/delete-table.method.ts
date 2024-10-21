import { Option, Some } from "@undb/domain"
import type { IDeleteTableDTO } from "../../dto"
import { TableComositeSpecification, WithTableForeignTablesSpec } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function deleteTableMethod(this: TableService, dto: IDeleteTableDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const referenceFields = table.schema.getReferenceFields()
  if (referenceFields.length > 0) {
    const updates: { table: TableDo; spec: Option<TableComositeSpecification> }[] = []

    const foreignTableSpec = new WithTableForeignTablesSpec(table.id)
    const foreignTables = await this.repository.find(Some(foreignTableSpec))

    for (const referenceField of referenceFields) {
      const foreignTable = foreignTables.find((t) => t.id.value === referenceField.foreignTableId)
      if (!foreignTable) {
        continue
      }

      const symmetricField = referenceField.getSymmetricField(foreignTable)
      if (symmetricField.isNone()) {
        continue
      }

      const rollupFields = symmetricField.unwrap().getRollupFields(foreignTable.schema.fields)

      const [, spec] = referenceField.$deleteSymmetricField(foreignTable)
      updates.push({ table: foreignTable, spec })

      for (const rollupField of rollupFields) {
        const [, spec] = foreignTable.$deleteField({ id: rollupField.id.value })
        updates.push({ table: foreignTable, spec })
      }
    }

    for (const foreignTable of foreignTables) {
      const referenceFields = foreignTable.schema
        .getReferenceFields()
        .filter(
          (referenceField) => !referenceField.symmetricFieldId && referenceField.foreignTableId === table.id.value,
        )

      for (const referenceField of referenceFields) {
        const [, spec] = foreignTable.$deleteField({ id: referenceField.id.value })
        updates.push({ table: foreignTable, spec })

        const rollupFields = referenceField.getRollupFields(foreignTable.schema.fields)
        for (const rollupField of rollupFields) {
          const [, spec] = foreignTable.$deleteField({ id: rollupField.id.value })
          updates.push({ table: foreignTable, spec })
        }
      }
    }

    await this.repository.bulkUpdate(updates)
  }

  table.$deleteTable()
  await this.repository.deleteOneById(table)

  return table
}
