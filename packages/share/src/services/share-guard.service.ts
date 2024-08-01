import { singleton } from "@undb/di"
import { NotFoundShare, ShareNotEnabled } from "../share.errors.js"
import type { Share } from "../share.js"
import { injectShareRepository, type IShareRepository } from "../share.repository.js"
import type { ShareSpecification } from "../specifications/index.js"

export interface IShareGuardService {
  verify(spec: ShareSpecification): Promise<Share>
}

@singleton()
export class ShareGuardService implements IShareGuardService {
  constructor(
    @injectShareRepository()
    protected readonly repo: IShareRepository,
  ) {}

  async verify(spec: ShareSpecification): Promise<Share> {
    const share = await this.repo.findOne(spec)
    if (share.isNone()) {
      throw new NotFoundShare()
    }

    const s = share.unwrap()
    if (!s.enabled) {
      throw new ShareNotEnabled()
    }

    return s
  }
}
