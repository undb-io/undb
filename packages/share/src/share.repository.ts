import { inject } from "@undb/di"
import type { Option } from "oxide.ts"
import type { IShareDTO } from "./dto/share.dto.js"
import type { Share } from "./share.js"
import type { ShareSpecification } from "./specifications/interface.js"

export interface IShareRepository {
  insert(share: Share): Promise<void>
  updateOneById(share: Share, spec: ShareSpecification): Promise<void>
  findOneById(id: string): Promise<Option<Share>>
  findOne(spec: ShareSpecification): Promise<Option<Share>>
  find(spec: ShareSpecification): Promise<Share[]>
  deleteOneById(id: string): Promise<void>
}

export const SHARE_REPOSITORY = Symbol("SHARE_REPOSITORY")
export const injectShareRepository = () => inject(SHARE_REPOSITORY)

export interface IShareQueryRepository {
  findOneById(id: string): Promise<Option<IShareDTO>>
  findOne(spec: ShareSpecification): Promise<Option<IShareDTO>>
  find(spec: ShareSpecification | null): Promise<IShareDTO[]>
}

export const SHARE_QUERY_REPOSITORY = Symbol("SHARE_QUERY_REPOSITORY")
export const injectShareQueryRepository = () => inject(SHARE_QUERY_REPOSITORY)
