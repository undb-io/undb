import { and } from "@undb/domain"
import type { ICreateSpaceDTO } from "./dto/create-space.dto.js"
import type { ISpaceDTO } from "./dto/space.dto.js"
import { SpaceCreatedEvent } from "./events/space-created.event"
import type { ISpaceSpecification } from "./interface"
import { Space } from "./space.do.js"
import { WithSpaceAvatar } from "./specifications/space-avatar.specification.js"
import { WithSpaceId } from "./specifications/space-id.specification"
import { WithSpaceIsPersonal } from "./specifications/space-is-personal.specification.js"
import { WithSpaceName } from "./specifications/space-name.specification"
import { SpaceId } from "./value-objects/space-id.vo.js"

export class SpaceFactory {
  static new(...specs: ISpaceSpecification[]): Space {
    return and(...specs)
      .unwrap()
      .mutate(Space.empty())
      .unwrap()
  }

  static fromJSON(dto: ISpaceDTO): Space {
    return this.new(
      WithSpaceId.fromString(dto.id),
      WithSpaceName.fromString(dto.name),
      WithSpaceAvatar.fromString(dto.avatar ?? undefined),
      new WithSpaceIsPersonal(dto.isPersonal),
    )
  }

  static create(input: ICreateSpaceDTO): Space {
    const space = this.new(
      new WithSpaceId(SpaceId.fromOrCreate(input.id)),
      WithSpaceName.fromString(input.name),
      WithSpaceAvatar.fromString(input.avatar ?? undefined),
      new WithSpaceIsPersonal(input.isPersonal ?? false),
    )

    // @ts-expect-error
    space.addDomainEvent(new SpaceCreatedEvent({ space: space.toJSON() }))

    return space
  }
}
