import type { IMutateRecordValueSchema, Table } from '@undb/core'
import type { IOpenAPIMutateRecordSchema } from 'src/schema/mutate-record.schema'

export const openAPIMutateRecordMapper = (
  table: Table,
  values: IOpenAPIMutateRecordSchema,
): IMutateRecordValueSchema => {
  const result: IOpenAPIMutateRecordSchema = {}

  const schema = table.schema.toNameMap()

  for (const [fieldName, value] of Object.entries(values)) {
    const field = schema.get(fieldName)
    if (field) {
      result[field.id.value] = value
    }
  }

  return result
}
