import { inject, singleton } from "@undb/di"
import { Option } from "@undb/domain"
import type { IEnableShareDTO, IShareDTO } from "../dto"
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
  getShareByTarget(target: IShareTarget): Promise<Option<IShareDTO>>
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

  async getShareByTarget(target: IShareTarget): Promise<Option<IShareDTO>> {
    const spec = withShare(target.type, target.id)

    return this.queryRepo.findOne(spec)
  }
}
