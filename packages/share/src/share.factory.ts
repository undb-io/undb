import { and } from "@undb/domain"
import type { IShareDTO } from "./dto/share.dto.js"
import { Share } from "./share.js"
import type { ShareSpecification } from "./specifications/index.js"
import { newShareSpec } from "./specifications/index.js"

export class ShareFactory {
  static create(...specs: ShareSpecification[]): Share {
    return and(...specs)
      .unwrap()
      .mutate(Share.empty())
      .unwrap()
  }

  static fromJSON(input: IShareDTO): Share {
    const spec = newShareSpec(input)

    return this.create(spec)
  }
}
