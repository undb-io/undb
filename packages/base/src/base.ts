import { AggregateRoot, and } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import type { Option } from "oxide.ts"
import type { IBaseDTO } from "./dto/base.dto.js"
import type { IUpdateBaseDTO } from "./dto/update-base.dto.js"
import { BaseUpdatedEvent } from "./events/base-updated.event.js"
import type { IBaseSpecification } from "./interface.js"
import { WithBaseName } from "./specifications/base-name.specification.js"
import type { BaseId, BaseName } from "./value-objects/index.js"

export class Base extends AggregateRoot<any> {
  id!: BaseId
  name!: BaseName
  spaceId!: ISpaceId

  static empty() {
    return new Base()
  }

  public $update(schema: IUpdateBaseDTO): Option<IBaseSpecification> {
    const previous = this.toJSON()
    const specs: IBaseSpecification[] = []

    if (schema.name) {
      specs.push(WithBaseName.fromString(schema.name))
    }

    const spec = and(...specs)
    if (spec.isSome()) {
      spec.unwrap().mutate(this)
    }

    const event = new BaseUpdatedEvent({ previous, base: this.toJSON() })
    this.addDomainEvent(event)

    return spec
  }

  public toJSON(): IBaseDTO {
    return {
      id: this.id.value,
      spaceId: this.spaceId,
      name: this.name.value,
    }
  }
}
