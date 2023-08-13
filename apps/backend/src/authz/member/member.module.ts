import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { NestMemberCreateService } from './member-create.service.js'
import { NestMemberService } from './member.service.js'
import { queries } from './queries/index.js'

@Global()
@Module({
  imports: [CqrsModule],
  providers: [NestMemberCreateService, NestMemberService, ...adapters, ...queries, ...commands],
  exports: [NestMemberCreateService, NestMemberService],
})
export class MemberModule {}
