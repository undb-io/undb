import type { ICommandHandler } from '@egodb/domain'
import { ILoginCommandOutput } from './login.command.interface.js'
import type { LoginCommand } from './login.command.js'

type ILoginCommandHandler = ICommandHandler<LoginCommand, ILoginCommandOutput>

interface IJwtService {
  sign: (obj: object) => string
}

export class LoginCommandHandler implements ILoginCommandHandler {
  constructor(protected readonly jwt: IJwtService) {}

  async execute({ user }: LoginCommand): Promise<ILoginCommandOutput> {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwt.sign(payload),
    }
  }
}
