import { inject } from "@undb/di"
import type { Option } from "oxide.ts"
import type { ApiTokenDo } from "./api-token.do"
import type { IApiTokenDTO } from "./dto"
import type { ApiTokenSpecification } from "./interface"

export interface IApiTokenRepository {
  insert(token: ApiTokenDo): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const API_TOKEN_REPOSITORY = Symbol("API_TOKEN_REPOSITORY")
export const injectApiTokenRepository = () => inject(API_TOKEN_REPOSITORY)

export interface IApiTokenQueryRepository {
  find(spec: ApiTokenSpecification): Promise<IApiTokenDTO[]>
  findOne(spec: ApiTokenSpecification): Promise<Option<IApiTokenDTO>>
  findOneById(id: string): Promise<Option<IApiTokenDTO>>
}

export const API_TOKEN_QUERY_REPOSITORY = Symbol("API_TOKEN_QUERY_REPOSITORY")
export const injectApiTokenQueryRepository = () => inject(API_TOKEN_QUERY_REPOSITORY)
