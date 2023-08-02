import type { RLSSpecification } from './interface.js'
import type { RLS } from './rls.js'

export interface IRLSRepository {
  find(spec: RLSSpecification): Promise<RLS[]>

  insert(rls: RLS): Promise<void>
  deleteOneById(id: string): Promise<void>
}
