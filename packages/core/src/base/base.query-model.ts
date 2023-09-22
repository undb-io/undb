import type { IQueryBase } from './base.schema'
import type { BaseSpecification } from './interface'

export interface IBaseQueryModel {
  find(spec: BaseSpecification): Promise<IQueryBase[]>
}
