import { filter, map, pipe, toArray } from '@fxts/core'
import type { ICreateFieldsSchema_internal, ICreateFieldValueSchema_internal } from '../field/index.js'
import { createFieldValueSchema_internal } from '../field/index.js'
import type { TableSchema } from '../value-objects/index.js'
import type { IMutateRecordValueSchema } from './record.schema.js'

export const createRecordInputs = (
  schema: TableSchema,
  value: IMutateRecordValueSchema,
): ICreateFieldsSchema_internal => {
  return pipe(
    value,
    map(({ id, value }) =>
      schema.getFieldById(id).map((field) => ({ type: field.type, field, value } as ICreateFieldValueSchema_internal)),
    ),
    filter((f) => f.isSome()),
    map((f) => f.unwrap()),
    map((f) => createFieldValueSchema_internal.parse(f)),
    toArray,
  )
}
