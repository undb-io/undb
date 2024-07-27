import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import type { Base } from "./base.js"
import type { IBaseDTO } from "./dto/base.dto.js"
import type { IBaseSpecification } from "./interface.js"

export interface IBaseRepository {
  find(spec: IBaseSpecification): Promise<Base[]>
  findOne(spec: IBaseSpecification): Promise<Option<Base>>
  findOneById(id: string): Promise<Option<Base>>

  insert(base: Base): Promise<void>
  updateOneById(base: Base, spec: IBaseSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const BASE_REPOSITORY = Symbol.for("IBaseRepository")
export const injectBaseRepository = () => inject(BASE_REPOSITORY)

export interface IBaseQueryRepository {
  find(spec: Option<IBaseSpecification>): Promise<IBaseDTO[]>
  findOneById(id: string): Promise<Option<IBaseDTO>>
}

export const BASE_QUERY_REPOSITORY = Symbol.for("IBaseQueryRepository")
export const injectBaseQueryRepository = () => inject(BASE_QUERY_REPOSITORY)
