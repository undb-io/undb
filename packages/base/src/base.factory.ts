import { and } from "@undb/domain"
import { Base } from "./base.js"
import type { IBaseDTO } from "./dto/base.dto.js"
import type { ICreateBaseDTO } from "./dto/create-base.dto.js"
import type { IBaseSpecification } from "./interface.js"
import { WithBaseId } from "./specifications/base-id.specification.js"
import { WithBaseName } from "./specifications/base-name.specification.js"
import { BaseId } from "./value-objects/base-id.vo.js"

export class BaseFactory {
  static new(...specs: IBaseSpecification[]): Base {
    return and(...specs)
      .unwrap()
      .mutate(Base.empty())
      .unwrap()
  }

  static fromJSON(dto: IBaseDTO): Base {
    return this.new(WithBaseId.fromString(dto.id), WithBaseName.fromString(dto.name))
  }

  static create(input: ICreateBaseDTO): Base {
    return this.new(new WithBaseId(BaseId.fromOrCreate(input.id)), WithBaseName.fromString(input.name))
  }
}
