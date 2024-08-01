import { None, type Option } from "@undb/domain"
import { match } from "ts-pattern"
import type { ICreateTableFieldDTO } from "../../dto"
import type { Field, MutableFieldValue } from "../../modules"
import { FieldValueFactory } from "../../modules/schema/fields/field-value.factory"
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
): Promise<{ table: TableDo; field: Field; spec: Option<TableComositeSpecification> }[]> {
  const foreignTable =
    field.option.foreignTableId === table.id.value
      ? table
      : (await this.repository.findOneById(new TableIdVo(field.option.foreignTableId))).expect(
          "not found foreign table",
        )

  const referenceField = ReferenceField.create(field)
  const symmetricField = ReferenceField.createSymmetricField(table, foreignTable, referenceField)

  const spec = table.$createFieldSpec(referenceField)
  const foreignSpec = foreignTable.$createFieldSpec(symmetricField)

  return [
    { table, spec, field: referenceField },
    { table: foreignTable, spec: foreignSpec, field: symmetricField },
  ]
}

async function setDefaultValue(this: TableService, updates: { table: TableDo; field: Field }[]) {
  for (const { table, field } of updates) {
    const defaultValue = (field.defaultValue as Option<MutableFieldValue>).into(undefined)
    if (!defaultValue || defaultValue.isEmpty() || !field.isDefaultValueValid) {
      continue
    }

    const fieldValue = FieldValueFactory.fromJSON(field, defaultValue.value)
    if (fieldValue.isNone()) {
      continue
    }

    const spec = field.$updateValue(fieldValue.unwrap() as any)
    if (spec.isNone()) {
      continue
    }
    await this.recordRepository.bulkUpdate(table, None, spec.unwrap(), [])
  }
}

export async function createTableFieldMethod(this: TableService, dto: ICreateTableFieldDTO): Promise<TableDo> {
  const table = (await this.repository.findOneById(new TableIdVo(dto.tableId))).expect("Not found table")

  const updates = await match(dto.field)
    .returnType<Promise<{ table: TableDo; field: Field; spec: Option<TableComositeSpecification> }[]>>()
    .with({ type: "reference" }, (field) => createReferenceField.call(this, table, field))
    .otherwise(async (input) => {
      const [field, spec] = table.$createField(input)
      return [{ table, field, spec }]
    })

  await this.repository.bulkUpdate(updates)
  await setDefaultValue.call(this, updates)

  return table
}
