import type { IMutateRecordValueSchema, Table } from '@undb/core'
import type { IOpenAPIMutateRecordSchema } from 'src/schema/mutate-record.schema'

export const openAPIMutateRecordMapper = (
  table: Table,
  values: IMutateRecordValueSchema,
): IOpenAPIMutateRecordSchema => {
  const result: IOpenAPIMutateRecordSchema = {}

  const schema = table.schema.toIdMap()

  for (const [fieldId, value] of Object.entries(values)) {
    const field = schema.get(fieldId)
    if (field) {
      result[field.name.value] = value
    }
  }

  return result
}
