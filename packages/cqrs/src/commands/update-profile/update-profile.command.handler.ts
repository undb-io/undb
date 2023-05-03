import type { IUserRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { IUpdateProfileCommandOutput } from './update-profile.command.interface.js'
import type { UpdateProfileCommand } from './update-profile.command.js'

type IUpdateProfileCommandHandler = ICommandHandler<UpdateProfileCommand, IUpdateProfileCommandOutput>

export class UpdateProfileCommandHandler implements IUpdateProfileCommandHandler {
  constructor(protected readonly repo: IUserRepository) {}
  async execute({ username, avatar, userId }: UpdateProfileCommand): Promise<void> {
    const user = (await this.repo.findOneById(userId)).unwrap()

    const spec = user.updateProfile({ username, avatar })

    if (spec.isSome()) {
      await this.repo.updateOneById(userId, spec.unwrap())
    }
  }
}
