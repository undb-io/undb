import type { RLSSpecification } from './interface.js'
import type { IQueryRLS } from './rls.schema.js'

export interface IRLSQueryModel {
  find(spec: RLSSpecification): Promise<IQueryRLS[]>
}
