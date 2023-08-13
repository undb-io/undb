import type { Option } from 'oxide.ts'
import type { RLSSpecification } from './interface.js'
import type { RLS } from './rls.js'

export interface IRLSRepository {
  find(spec: RLSSpecification): Promise<RLS[]>
  findOneById(id: string): Promise<Option<RLS>>

  insert(rls: RLS): Promise<void>
  updateOneById(id: string, spec: RLSSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}
