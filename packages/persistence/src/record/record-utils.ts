import {
  FieldIdVo,
  ID_TYPE,
  type Field,
  type IRecordDTO,
  type IRecordDisplayValues,
  type IRecordValues,
  type TableDo,
} from "@undb/table"
import { isString } from "radash"

export type DisplayFieldName = `$${string}`

/**
 * Create a display field name for a field.
 * @param field The field to create a display field name for.
 * @returns The display field name.
 */
export function createDisplayFieldName(field: Field): DisplayFieldName {
  return `$${field.id.value}`
}

/**
 * Check if a field name is a display field name.
 * @param name The field name to check.
 * @returns `true` if the field name is a display field name, `false` otherwise.
 */
export function isDisplayerFieldName(name: string): name is DisplayFieldName {
  return name.startsWith("$")
}

/**
 * Get the raw field name from a display field name.
 * @param displayFieldName The display field name.
 * @returns The raw field name.
 */
export function getRawFieldName(displayFieldName: DisplayFieldName): string {
  return displayFieldName.slice(1)
}

/**
 * Get the record DTO from an entity. The record DTO is the DTO that is returned to the client. It contains the values and display values of the record.
 * @param entity The entity to get the record DTO from.
 * @returns The record DTO.
 */
export function getRecordDTOFromEntity(table: TableDo, entity: any): IRecordDTO {
  const id = entity.id
  const values: IRecordValues = {}
  const displayValues: IRecordDisplayValues = {}
  const schema = table.schema
  for (const [key, value] of Object.entries(entity)) {
    if (key === ID_TYPE) continue

    if (isDisplayerFieldName(key)) {
      displayValues[getRawFieldName(key)] = value
      continue
    }

    const field = schema.getFieldById(new FieldIdVo(key)).into(undefined)
    if (!field) continue

    if (field.type === "reference" && isString(value)) {
      values[key] = JSON.parse(value)
      continue
    }

    values[key] = value
  }

  return {
    id,
    values,
    displayValues,
  }
}
