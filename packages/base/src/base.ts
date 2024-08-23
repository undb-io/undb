import { AggregateRoot, and } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { getNextName } from "@undb/utils"
import type { Option } from "oxide.ts"
import { BaseFactory } from "./base.factory.js"
import type { IBaseDTO } from "./dto/base.dto.js"
import type { IDuplicateBaseDTO } from "./dto/duplicate-base.dto.js"
import type { IUpdateBaseDTO } from "./dto/update-base.dto.js"
import { BaseUpdatedEvent } from "./events/base-updated.event.js"
import type { IBaseSpecification } from "./interface.js"
import { WithBaseName } from "./specifications/base-name.specification.js"
import { DuplicatedBaseSpecification } from "./specifications/base.specification.js"
import { BaseId, BaseOption, type BaseName } from "./value-objects/index.js"

export class Base extends AggregateRoot<any> {
  id!: BaseId
  name!: BaseName
  spaceId!: ISpaceId
  option: BaseOption = new BaseOption({})

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

  public $duplicate(dto: IDuplicateBaseDTO, baseNames: string[]): DuplicatedBaseSpecification {
    const duplicatedBase = BaseFactory.fromJSON({
      ...this.toJSON(),
      option: { ...this.option?.toJSON() },
      id: BaseId.create().value,
      spaceId: dto.spaceId ?? this.spaceId,
      name: dto.name ?? getNextName(baseNames, this.name.value),
    })

    return new DuplicatedBaseSpecification(this, duplicatedBase)
  }

  public toJSON(): IBaseDTO {
    return {
      id: this.id.value,
      spaceId: this.spaceId,
      name: this.name.value,
      option: this.option?.toJSON(),
    }
  }
}
