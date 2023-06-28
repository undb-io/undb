import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import type { IQueryUser } from '@undb/core'
import { WithUserEmail } from '@undb/core'
import { GetMeQuery, LoginCommand, RegisterCommand, UpdateProfileCommand } from '@undb/cqrs'
import * as bcrypt from 'bcrypt'
import { UserService } from '../core/user/user.service.js'
import { InvalidPassword } from './errors/invalid-password.error.js'
import { UserNotFound } from './errors/user-not-found.error.js'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async validateUser(email: string, pass: string): Promise<IQueryUser> {
    const user = await this.usersService.findOne(WithUserEmail.fromString(email))
    if (!user) {
      throw new UserNotFound()
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.password)
    if (!isPasswordMatch) {
      throw new InvalidPassword()
    }
    return user.toQuery()
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.commandBus.execute(new RegisterCommand({ email, password: hashedPassword }))
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
}
