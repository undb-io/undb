import type { Option } from 'oxide.ts'
import type { IQueryBase } from './base.schema'
import type { BaseSpecification } from './interface'

export interface IBaseQueryModel {
  find(spec: Option<BaseSpecification>): Promise<IQueryBase[]>
  findOneById(id: string): Promise<Option<IQueryBase>>
}
