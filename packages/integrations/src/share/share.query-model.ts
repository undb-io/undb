import type { Option } from 'oxide.ts'
import type { IQueryShare } from './share.type.js'
import type { ShareSpecification } from './specifications/index.js'

export interface IShareQueryModel {
  findOneById: (id: string) => Promise<Option<IQueryShare>>
  findOne: (spec: ShareSpecification) => Promise<Option<IQueryShare>>
  find: (spec: ShareSpecification | null) => Promise<IQueryShare[]>
}
