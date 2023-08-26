import type { Option } from 'oxide.ts'
import type { FLS } from './fls.js'
import type { FLSSpecification } from './interface.js'

export interface IFLSRepository {
  find(spec: FLSSpecification): Promise<FLS[]>
  findOneById(id: string): Promise<Option<FLS>>

  insert(rls: FLS): Promise<void>
  updateOneById(id: string, spec: FLSSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}
