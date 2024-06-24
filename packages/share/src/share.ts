import { AggregateRoot, and } from "@undb/domain"
import type { Option } from "oxide.ts"
import type { IEnableShareDTO } from "./dto/enable-share.dto.js"
import type { IShareDTO } from "./dto/share.dto.js"
import type { ShareId } from "./share-id.vo.js"
import type { ShareTarget } from "./share-target.vo.js"
import type { ShareSpecification } from "./specifications/interface.js"
import { WithShareEnabled } from "./specifications/share-enabled.specification.js"

export class Share extends AggregateRoot<any> {
  id!: ShareId
  target!: ShareTarget
  enabled!: boolean

  static empty() {
    return new Share()
  }

  public $enable(input: IEnableShareDTO): Option<ShareSpecification> {
    const specs: ShareSpecification[] = []

    if (typeof input.enabled === "boolean") {
      specs.push(new WithShareEnabled(input.enabled))
    }

    return and(...specs)
  }

  public toJSON(): IShareDTO {
    return {
      id: this.id.value,
      target: this.target.toJSON(),
      enabled: this.enabled,
    }
  }
}
