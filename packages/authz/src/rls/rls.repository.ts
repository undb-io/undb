import { RLSSpecification } from './interface'
import { RLS } from './rls.js'

export interface IRLSRepository {
  find(spec: RLSSpecification): Promise<RLS[]>

  insert(rls: RLS): Promise<void>
}
