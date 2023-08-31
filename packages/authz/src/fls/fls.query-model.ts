import type { IQueryFLS } from './fls.schema.js'
import type { FLSSpecification } from './interface.js'

export interface IFLSQueryModel {
  find(spec: FLSSpecification): Promise<IQueryFLS[]>
}
