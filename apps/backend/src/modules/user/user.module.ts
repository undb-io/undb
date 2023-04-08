import { Module } from '@nestjs/common'
import { dbAdapters } from './adapters/index.js'
import { UserService } from './user.service.js'

@Module({
  providers: [UserService, ...dbAdapters],
  exports: [UserService, ...dbAdapters],
})
export class UserModule {}
