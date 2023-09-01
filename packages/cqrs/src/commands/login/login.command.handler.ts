import type { ICommandHandler } from '@undb/domain'
import type { ILoginCommandOutput } from './login.command.interface.js'
import type { LoginCommand } from './login.command.js'

type ILoginCommandHandler = ICommandHandler<LoginCommand, ILoginCommandOutput>

export class LoginCommandHandler implements ILoginCommandHandler {
  async execute({ user }: LoginCommand): Promise<ILoginCommandOutput> {
    const payload = { email: user.email, sub: user.userId }
    return payload
  }
}
