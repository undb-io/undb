import type { Option } from 'oxide.ts'
import { Share } from './share.js'
import { ShareSpecification } from './specifications/interface.js'

export interface IShareRepository {
  insert(webhook: Share): Promise<void>
  updateOneById(id: string, spec: ShareSpecification): Promise<void>
  findOneById(id: string): Promise<Option<Share>>
  findOne(spec: ShareSpecification): Promise<Option<Share>>
  find(spec: ShareSpecification): Promise<Share[]>
  deleteOneById(id: string): Promise<void>
}
