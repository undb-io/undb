import { Module } from '@nestjs/common'
import { adapters } from './adapters/index.js'
import { NestMemberCreateService } from './member-create.service.js'
import { NestMemberService } from './member.service.js'

@Module({
  providers: [NestMemberCreateService, NestMemberService, ...adapters],
  exports: [NestMemberCreateService, NestMemberService],
})
export class MemberModule {}
