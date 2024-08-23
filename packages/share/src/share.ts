import { AggregateRoot, and } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Option } from "oxide.ts"
import type { IDisableShareDTO } from "./dto/disable-share.dto.js"
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
  spaceId!: ISpaceId

  static empty() {
    return new Share()
  }

  public $enable(input: IEnableShareDTO): Option<ShareSpecification> {
    const specs: ShareSpecification[] = []

    specs.push(new WithShareEnabled(true))

    const spec = and(...specs)

    if (spec.isSome()) {
      spec.unwrap().mutate(this)
    }

    return spec
  }

  public $disable(input: IDisableShareDTO): Option<ShareSpecification> {
    const specs: ShareSpecification[] = []

    specs.push(new WithShareEnabled(false))

    const spec = and(...specs)

    if (spec.isSome()) {
      spec.unwrap().mutate(this)
    }

    return spec
  }

  public toJSON(): IShareDTO {
    return {
      id: this.id.value,
      target: this.target.toJSON(),
      enabled: this.enabled,
      spaceId: this.spaceId,
    }
  }
}
