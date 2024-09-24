import { createLogger } from "@undb/logger"
import {
  FieldIdVo,
  ID_TYPE,
  type Field,
  type IRecordDTO,
  type IRecordDisplayValues,
  type IRecordValues,
  type TableDo,
} from "@undb/table"
import { format } from "date-fns/fp"
import { isNumber, isString } from "radash"

const formatter = format("yyyy-MM-dd")

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

const logger = createLogger("record-utils")

/**
 * Get the record DTO from an entity. The record DTO is the DTO that is returned to the client. It contains the values and display values of the record.
 * @param entity The entity to get the record DTO from.
 * @returns The record DTO.
 */
export function getRecordDTOFromEntity(table: TableDo, entity: any, foreignTables: Map<string, TableDo>): IRecordDTO {
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
      } else if (
        (field.type === "user" || field.type === "createdBy" || field.type === "updatedBy") &&
        isString(value)
      ) {
        displayValues[key] = JSON.parse(value)
      } else if (value) {
        displayValues[key] = value
      }
      continue
    } else {
      if (field.type === "select") {
        if (field.isSingle) {
          const optionId = value
          const option = field.options.find((o) => o.id === optionId)
          displayValues[key] = option?.name
        } else if (Array.isArray(value)) {
          const optionIds = value
          displayValues[key] = optionIds.map((optionId) => {
            const option = field.options.find((o) => o.id === optionId)
            return option?.name
          })
        }
      }

      if (
        (field.type === "reference" ||
          field.type === "attachment" ||
          field.type === "json" ||
          ((field.type === "select" || field.type === "user") && field.isMultiple)) &&
        isString(value)
      ) {
        try {
          values[key] = JSON.parse(value)
        } catch (error) {
          logger.warn({ error, value }, "Error parsing JSON")
          values[key] = [value]
        }
        continue
      }

      if (field.type === "rollup" && field.fn === "lookup") {
        const foreignTable = field.getForeignTable(table, foreignTables)
        let lookupField: Field | undefined = undefined
        if (foreignTable) {
          const rollupField = field.getRollupField(foreignTable)
          if (rollupField.isSome()) {
            lookupField = rollupField.unwrap()
          }
        }

        function handleValue(value: (string | number)[]) {
          if (lookupField?.type === "date") {
            return value
              .map((v: string | number) => (v ? new Date(v).toISOString() : null))
              .map((v) => (v ? formatter(v) : null))
          } else if (lookupField?.type === "select") {
            return value.map((v) => lookupField.getOptionById(v)?.name ?? null)
          } else {
            return value
          }
        }

        if (Array.isArray(value)) {
          values[key] = handleValue(value)
          continue
        } else if (isString(value)) {
          try {
            values[key] = JSON.parse(value)
            values[key] = handleValue(values[key])
          } catch (error) {
            logger.warn({ error, value }, "Error parsing JSON")
            values[key] = [value]
          }
          continue
        }
      }

      if (field.type === "checkbox") {
        values[key] = Boolean(value)
        continue
      }
      if (field.type === "date" && (isString(value) || isNumber(value))) {
        values[key] = new Date(value).toISOString()
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
