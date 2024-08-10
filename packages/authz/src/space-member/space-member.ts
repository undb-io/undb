import { ValueObject } from "@undb/domain"
import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { memberId } from "../member/member-id.vo"

export const spaceMemberRole = z.enum(["owner", "admin", "editor", "viewer"])
export const spaceMemberWithoutOwner = z.enum(["admin", "editor", "viewer"])

export type ISpaceMemberRole = z.infer<typeof spaceMemberRole>
export type ISpaceMemberWithoutOwner = z.infer<typeof spaceMemberWithoutOwner>

export const spaceMember = z.object({
  id: memberId,
  userId: z.string(),
  spaceId: spaceIdSchema,
  role: spaceMemberRole,
})

export type ISpaceMember = z.infer<typeof spaceMember>

export class SpaceMember extends ValueObject<ISpaceMember> {
  toJSON(): ISpaceMember {
    return {
      id: this.props.id,
      role: this.props.role,
      spaceId: this.props.spaceId,
      userId: this.props.userId,
    }
  }
}
