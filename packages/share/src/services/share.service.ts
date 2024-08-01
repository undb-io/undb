import { inject, singleton } from "@undb/di"
import { Option } from "@undb/domain"
import {
  TableComositeSpecification,
  WithFormIdSpecification,
  WithViewIdSpecification,
  injectTableQueryRepository,
  type ITableDTO,
  type ITableQueryRepository,
} from "@undb/table"
import { match } from "ts-pattern"
import type { IDisableShareDTO, IEnableShareDTO, IShareDTO } from "../dto"
import type { IShareTarget } from "../share-target.vo"
import { ShareFactory } from "../share.factory"
import {
  injectShareQueryRepository,
  injectShareRepository,
  type IShareQueryRepository,
  type IShareRepository,
} from "../share.repository"
import { WithShareId, withShare } from "../specifications"

export interface IShareService {
  enableShare(dto: IEnableShareDTO): Promise<void>
  disableShare(dto: IDisableShareDTO): Promise<void>
  getShare(id: string): Promise<Option<IShareDTO>>
  getShareByTarget(target: IShareTarget): Promise<Option<IShareDTO>>
  getTableByShare(id: string): Promise<ITableDTO>
}

export const SHARE_SERVICE = Symbol.for("SHARE_SERVICE")
export const injectShareService = () => inject(SHARE_SERVICE)

@singleton()
export class ShareService implements IShareService {
  constructor(
    @injectShareRepository()
    private readonly repo: IShareRepository,
    @injectShareQueryRepository()
    private readonly queryRepo: IShareQueryRepository,
    @injectTableQueryRepository()
    private readonly tableRepo: ITableQueryRepository,
  ) {}

  async enableShare(dto: IEnableShareDTO): Promise<void> {
    const spec = withShare(dto.target.type, dto.target.id)

    let share = (await this.repo.findOne(spec)).into(undefined)
    if (!share) {
      share = ShareFactory.create(WithShareId.create(), spec)
    }

    const s = share.$enable(dto)

    if (s.isSome()) {
      await this.repo.updateOneById(share, s.unwrap())
    }
  }

  async disableShare(dto: IEnableShareDTO): Promise<void> {
    const spec = withShare(dto.target.type, dto.target.id)

    let share = (await this.repo.findOne(spec)).into(undefined)
    if (!share) {
      return
    }

    const s = share.$disable(dto)

    if (s.isSome()) {
      await this.repo.updateOneById(share, s.unwrap())
    }
  }

  async getShare(id: string): Promise<Option<IShareDTO>> {
    return this.queryRepo.findOne(WithShareId.fromString(id))
  }

  async getShareByTarget(target: IShareTarget): Promise<Option<IShareDTO>> {
    const spec = withShare(target.type, target.id)

    return this.queryRepo.findOne(spec)
  }

  async getTableByShare(id: string): Promise<ITableDTO> {
    const share = (await this.repo.findOneById(id)).expect("share not found")

    const spec = match(share.target.type)
      .returnType<TableComositeSpecification>()
      .with("form", () => new WithFormIdSpecification(share.target.id))
      .with("view", () => new WithViewIdSpecification(share.target.id))
      .exhaustive()

    return (await this.tableRepo.findOne(spec)).expect("table not found")
  }
}
