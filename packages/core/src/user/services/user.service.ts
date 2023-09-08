import { WithUserColor } from '../specifications/user-color.js'
import { WithUserEmail } from '../specifications/user-email.specification.js'
import { WithUserId } from '../specifications/user-id.specification.js'
import { WithUserPassword } from '../specifications/user-password.specification.js'
import { WithUsername } from '../specifications/username.specification.js'
import { UserFactory } from '../user.factory.js'
import type { User } from '../user.js'
import type { IUserRepository } from '../user.repository.js'

export interface IUserService {
  register(email: string, password: string): Promise<User>
}

export interface PasswordCryptor {
  hash(password: string): Promise<string>
  compare(p1: string, p2: string): Promise<boolean>
}

export class UserService implements IUserService {
  constructor(
    protected readonly cryptor: PasswordCryptor,
    protected readonly repo: IUserRepository,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await this.cryptor.hash(password)

    const user = UserFactory.create(
      WithUserEmail.fromString(email),
      WithUserPassword.fromString(hashedPassword),
      WithUserId.create(),
      WithUsername.fromEmail(email),
      WithUserColor.random(),
    )

    await this.repo.insert(user)

    return user
  }
}
