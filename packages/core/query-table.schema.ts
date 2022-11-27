import type { IQueryColumnsSchema } from './column'

export interface QueryTable {
  id: string
  name: string
  columns: IQueryColumnsSchema
}
