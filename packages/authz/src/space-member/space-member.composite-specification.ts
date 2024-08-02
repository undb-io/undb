import { CompositeSpecification } from "@undb/domain"
import type { SpaceMember } from "./space-member"
import type { ISpaceMemberVisitor } from "./space-member.visitor"

export abstract class SpaceMemberComositeSpecification extends CompositeSpecification<
  SpaceMember,
  ISpaceMemberVisitor
> {}
