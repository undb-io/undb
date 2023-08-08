import { Module } from '@nestjs/common'
import { adapters } from './adapters/index.js'
import { NestMemberCreateService } from './member-create.service.js'

@Module({
  providers: [NestMemberCreateService, ...adapters],
  exports: [NestMemberCreateService],
})
export class MemberModule {}
