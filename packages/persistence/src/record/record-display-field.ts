import type { Field, IRecordDTO, IRecordDisplayValues, IRecordValues } from "@undb/table"

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

export function getRecordDTOFromEntity(entity: any): IRecordDTO {
  const id = entity.id
  const values: IRecordValues = {}
  const displayValues: IRecordDisplayValues = {}
  for (const [key, value] of Object.entries(entity)) {
    if (key === "id") continue

    if (isDisplayerFieldName(key)) {
      displayValues[getRawFieldName(key)] = value
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
