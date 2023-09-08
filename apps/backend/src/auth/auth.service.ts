import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import type { IQueryUser } from '@undb/core'
import { WithUserEmail } from '@undb/core'
import { GetMeQuery, LoginCommand, RegisterCommand, UpdateProfileCommand } from '@undb/cqrs'
import { NestMemberCreateService } from '../authz/member/member-create.service.js'
import type { authConfig } from '../configs/auth.config.js'
import { InjectAuthConfig } from '../configs/auth.config.js'
import { UserService } from '../core/user/user.service.js'
import { CryptService } from './crypt.service.js'
import { InvalidPassword } from './errors/invalid-password.error.js'
import { UserNotFound } from './errors/user-not-found.error.js'
import { NestUserService } from './user.service.js'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectAuthConfig()
    private readonly config: ConfigType<typeof authConfig>,
    private readonly memberService: NestMemberCreateService,
    private readonly userService: NestUserService,
    private readonly crypt: CryptService,
  ) {}

  async validateUser(email: string, pass: string): Promise<IQueryUser> {
    const user = await this.usersService.findOne(WithUserEmail.fromString(email))
    if (!user) {
      throw new UserNotFound()
    }

    const isPasswordMatch = await this.crypt.compare(pass, user.password)
    if (!isPasswordMatch) {
      throw new InvalidPassword()
    }
    return user.toQuery()
  }

  async register(email: string, password: string) {
    return this.commandBus.execute(new RegisterCommand({ email, password }))
  }

  async login(user: IQueryUser) {
    return this.commandBus.execute(new LoginCommand({ user }))
  }

  async me(user: IQueryUser) {
    return this.queryBus.execute(new GetMeQuery({ me: user }))
  }

  async updateProfile(userId: string, profile: { username?: string; avatar?: string | null }) {
    return this.commandBus.execute(new UpdateProfileCommand({ userId, ...profile }))
  }

  async createAdmin() {
    const { admin } = this.config
    if (admin.email && admin.password) {
      const email = WithUserEmail.fromString(admin.email)
      const exists = await this.usersService.exists(email)
      if (exists) return

      const user = await this.userService.register(admin.email, admin.password)
      await this.memberService.grantDefault(user)
    }
  }
}
