import { Injectable } from '@nestjs/common'
import type { PasswordCryptor } from '@undb/core'
import * as bcrypt from 'bcrypt'

@Injectable()
export class CryptService implements PasswordCryptor {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  compare(p1: string, p2: string): Promise<boolean> {
    return bcrypt.compare(p1, p2)
  }
}
