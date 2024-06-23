import type { Option } from "oxide.ts"
import type { Base } from "./base.js"
import type { IBaseDTO } from "./dto/base.dto.js"
import type { IBaseSpecification } from "./interface.js"

export interface IBaseRepository {
  find(spec: IBaseSpecification): Promise<Base[]>
  findOneById(id: string): Promise<Option<Base>>

  insert(base: Base): Promise<void>
  updateOneById(id: string, spec: IBaseSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export interface IBaseQueryRepository {
  find(spec: Option<IBaseSpecification>): Promise<IBaseDTO[]>
  findOneById(id: string): Promise<Option<IBaseDTO>>
}
