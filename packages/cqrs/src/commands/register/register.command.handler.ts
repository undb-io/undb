import type { IMemberCreateService } from '@undb/authz'
import type { IUserRepository, IUserService } from '@undb/core'
import { WithUserEmail } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IRegisterCommandOutput } from './register.command.interface.js'
import type { RegisterCommand } from './register.command.js'

type IRegisterCommandHandler = ICommandHandler<RegisterCommand, IRegisterCommandOutput>

export class RegisterCommandHandler implements IRegisterCommandHandler {
  constructor(
    protected readonly repo: IUserRepository,
    protected readonly memberService: IMemberCreateService,
    protected readonly svc: IUserService,
  ) {}

  async execute({ email, password }: RegisterCommand): Promise<IRegisterCommandOutput> {
    const exists = await this.repo.exists(WithUserEmail.fromString(email))
    if (exists) throw new Error('user already exists')

    const user = await this.svc.register(email, password)
    await this.memberService.grantDefault(user)

    return { email, sub: user.userId.value }
  }
}
