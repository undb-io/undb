import type {
  ISpaceSpecVisitor,
  WithSpaceApiToken,
  WithSpaceAvatar,
  WithSpaceBaseId,
  WithSpaceId,
  WithSpaceIsPersonal,
  WithSpaceName,
  WithSpaceShareId,
  WithSpaceTableId,
  WithSpaceUserId,
} from "@undb/space"
import { AbstractQBMutationVisitor } from "../abstract-qb.visitor"

export class SpaceMutateVisitor extends AbstractQBMutationVisitor implements ISpaceSpecVisitor {
  withId(v: WithSpaceId): void {
    throw new Error("Method not implemented.")
  }
  withUserId(v: WithSpaceUserId): void {
    throw new Error("Method not implemented.")
  }
  withTableId(v: WithSpaceTableId): void {
    throw new Error("Method not implemented.")
  }
  withBaseId(v: WithSpaceBaseId): void {
    throw new Error("Method not implemented.")
  }
  withShareId(v: WithSpaceShareId): void {
    throw new Error("Method not implemented.")
  }
  withApiToken(v: WithSpaceApiToken): void {
    throw new Error("Method not implemented.")
  }
  withIsPersonal(v: WithSpaceIsPersonal): void {
    throw new Error("Method not implemented.")
  }
  withName(v: WithSpaceName): void {
    this.setData("name", v.name.value)
  }
  withAvatar(v: WithSpaceAvatar): void {
    this.setData("avatar", v.avatar?.value ?? null)
  }
}
