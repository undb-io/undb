import type { Base } from './base.js'
import type { BaseSpecification } from './interface.js'

export interface BaseRepository {
  find(spec: BaseSpecification): Promise<Base[]>
}
