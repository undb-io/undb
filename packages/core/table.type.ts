import type { IQuerySchemaSchema } from './field'
import type { IQueryView } from './view/view.type'

export interface IQueryTable {
  id: string
  name: string
  schema: IQuerySchemaSchema
  defaultView: IQueryView
}
