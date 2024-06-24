import type { Option } from "@undb/domain"
import { match } from "ts-pattern"
import type { ICreateTableFieldDTO } from "../../dto"
import {
  ReferenceField,
  type ICreateReferenceFieldDTO,
} from "../../modules/schema/fields/variants/reference-field/reference-field.vo"
import type { TableComositeSpecification } from "../../specifications"
import { TableIdVo } from "../../table-id.vo"
import type { TableDo } from "../../table.do"
import type { TableService } from "../table.service"

export async function createReferenceField(
  this: TableService,
  table: TableDo,
  field: ICreateReferenceFieldDTO,
): Promise<{ table: TableDo; spec: Option<TableComositeSpecification> }[]> {
  const foreignTable =
    field.option.foreignTableId === table.id.value
      ? table
      : (await this.repository.findOneById(new TableIdVo(field.option.foreignTableId))).expect(
          "not found foreign table",
        )

  const referenceField = ReferenceField.create(field)
  const symmetricField = ReferenceField.createSymmetricField(table, foreignTable, referenceField)
  referenceField.connect(symmetricField)

  const spec = table.$createFieldSpec(referenceField)
  const foreignSpec = foreignTable.$createFieldSpec(symmetricField)

  if (spec.isSome()) {
    spec.unwrap().mutate(table)
  }
  if (foreignSpec.isSome()) {
    foreignSpec.unwrap().mutate(foreignTable)
  }

  return [
    { table, spec },
    { table: foreignTable, spec: foreignSpec },
  ]
}

export async function createTableFieldMethod(this: TableService, dto: ICreateTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const updates = await match(dto.field)
    .returnType<Promise<{ table: TableDo; spec: Option<TableComositeSpecification> }[]>>()
    .with({ type: "reference" }, (field) => createReferenceField.call(this, table, field))
    .otherwise(async (field) => [{ table, spec: table.$createField(field) }])

  await this.repository.bulkUpdate(updates)

  return table
}
