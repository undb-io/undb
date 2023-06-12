import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/index.js'
import { UserQueries } from './queries/index.js'
import { UserService } from './user.service.js'

@Module({
  imports: [CqrsModule],
  providers: [UserService, ...dbAdapters, ...UserQueries],
  exports: [UserService, ...dbAdapters],
})
export class UserModule {}
