import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MemberModule } from '../authz/member/member.module.js'
import { providers } from './providers/index.js'

@Module({
  imports: [CqrsModule, MemberModule],
  providers,
})
export class TrpcModule {}
