import type { Option } from 'oxide.ts'
import type { Share } from './share.js'
import type { ShareSpecification } from './specifications/interface.js'

export interface IShareRepository {
  insert(share: Share): Promise<void>
  updateOneById(id: string, spec: ShareSpecification): Promise<void>
  findOneById(id: string): Promise<Option<Share>>
  findOne(spec: ShareSpecification): Promise<Option<Share>>
  find(spec: ShareSpecification): Promise<Share[]>
  deleteOneById(id: string): Promise<void>
}
