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
 * Returns the expanded field name for a given field.
 *
 * @param field - The field object.
 * @returns The expanded field name.
 */
export function getJsonExpandedFieldName(field: Field): string {
  return `${field.id.value}_expanded`
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
  for (let [key, value] of Object.entries(entity)) {
    if (key === ID_TYPE) continue
    const isDisplay = isDisplayerFieldName(key)
    if (isDisplay) {
      key = getRawFieldName(key as DisplayFieldName)
    }

    const field = schema.getFieldById(new FieldIdVo(key)).into(undefined)
    if (!field) continue

    if (isDisplay) {
      if (field.type === "reference" && isString(value)) {
        const parsed = JSON.parse(value)
        for (let [key, value] of Object.entries(parsed)) {
          parsed[key] = JSON.parse(value as string)
        }
        displayValues[key] = parsed
      } else {
        displayValues[key] = value
      }
      continue
    } else {
      if (
        (field.type === "reference" ||
          field.type === "attachment" ||
          field.type === "json" ||
          ((field.type === "select" || field.type === "user") && field.isMultiple)) &&
        isString(value)
      ) {
        values[key] = JSON.parse(value)
        continue
      }

      if (field.type === "checkbox") {
        values[key] = Boolean(value)
        continue
      }
      values[key] = value
    }
  }

  return {
    id,
    values,
    displayValues,
  }
}
