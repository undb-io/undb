import type { IQuerySchemaSchema } from './field'

export interface QueryTable {
  id: string
  name: string
  schema: IQuerySchemaSchema
}
