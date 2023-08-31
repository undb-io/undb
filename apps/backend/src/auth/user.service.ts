import { Injectable } from '@nestjs/common'
import { UserService, type IUserRepository } from '@undb/core'
import { InjectUserRepository } from '../core/user/adapters/index.js'
import { CryptService } from './crypt.service.js'

@Injectable()
export class NestUserService extends UserService {
  constructor(cryptor: CryptService, @InjectUserRepository() repo: IUserRepository) {
    super(cryptor, repo)
  }
}
