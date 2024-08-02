import { AggregateRoot, and } from "@undb/domain"
import type { Option } from "oxide.ts"
import type { ISpaceDTO } from "./dto/space.dto"
import type { IUpdateSpaceDTO } from "./dto/update-space.dto"
import { SpaceUpdatedEvent } from "./events/space-updated.event.js"
import type { ISpaceSpecification } from "./interface.js"
import { WithSpaceName } from "./specifications/space-name.specification.js"
import type { SpaceId, SpaceName } from "./value-objects/index.js"

export class Space extends AggregateRoot<any> {
  id!: SpaceId
  name!: SpaceName
  isPersonal: boolean = false

  static empty() {
    return new Space()
  }

  public $update(schema: IUpdateSpaceDTO): Option<ISpaceSpecification> {
    const previous = this.toJSON()
    const specs: ISpaceSpecification[] = []

    if (schema.name) {
      specs.push(WithSpaceName.fromString(schema.name))
    }

    const spec = and(...specs)
    if (spec.isSome()) {
      spec.unwrap().mutate(this)
    }

    const event = new SpaceUpdatedEvent({ previous, space: this.toJSON() })
    this.addDomainEvent(event)

    return spec
  }

  public toJSON(): ISpaceDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      isPersonal: this.isPersonal,
    }
  }
}
