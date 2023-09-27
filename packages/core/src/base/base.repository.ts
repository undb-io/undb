import type { Option } from 'oxide.ts'
import type { Base } from './base.js'
import type { BaseSpecification } from './interface.js'

export interface BaseRepository {
  find(spec: BaseSpecification): Promise<Base[]>
  findOneById(id: string): Promise<Option<Base>>

  insert(base: Base): Promise<void>
  updateOneById(id: string, spec: BaseSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}
