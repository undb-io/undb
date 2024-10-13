export * from "./base-id.specification.js"
export * from "./base-name.specification.js"
export * from "./base-option.specification.js"
export * from "./base-q.specification.js"
export * from "./base-space-id.specification.js"
export * from "./base.specification.js"

import { CompositeSpecification, Err, Ok, Result } from "@undb/domain"
import type { Base } from "../base.js"
import type { IUniqueBaseDTO } from "../dto/unique-base.dto.js"
import type { IBaseSpecVisitor } from "../interface.js"
import { BaseId } from "../value-objects/base-id.vo.js"
import { WithBaseId } from "./base-id.specification.js"
import { WithBaseName } from "./base-name.specification.js"

type BaseComositeSpecification = CompositeSpecification<Base, IBaseSpecVisitor>

export const withUniqueBase = (dto: IUniqueBaseDTO): Result<BaseComositeSpecification, string> => {
  if (dto.baseId) {
    return Ok(new WithBaseId(new BaseId(dto.baseId)))
  }
  if (dto.baseName && dto.spaceId) {
    return Ok(WithBaseName.fromString(dto.baseName))
  }
  return Err("Invalid base specification")
}
