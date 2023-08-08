import { Module } from '@nestjs/common'
import { MemberModule } from './member/member.module.js'
import { RLSModule } from './rls/rls.module.js'

@Module({
  imports: [RLSModule, MemberModule],
})
export class AuthzModule {}
