import type { IMemberRepository } from '@undb/authz'
import type { ICommandHandler } from '@undb/domain'
import type * as updateRoleCommandJs from './update-role.command.js'

export class UpdateRoleCommandHandler implements ICommandHandler<updateRoleCommandJs.UpdateRoleCommand, void> {
  constructor(protected readonly memberRepo: IMemberRepository) {}

  async execute(command: updateRoleCommandJs.UpdateRoleCommand): Promise<void> {
    const member = (await this.memberRepo.findOneById(command.memberId)).unwrap()

    const spec = member.updateRole(command.role)

    if (spec.isSome()) {
      await this.memberRepo.updateOneById(member.id.value, spec.unwrap())
    }
  }
}
