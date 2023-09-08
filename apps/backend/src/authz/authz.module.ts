import { Global, Module } from '@nestjs/common'
import { AuthzGuard } from './authz.guard.js'
import { FLSModule } from './fls/fls.module.js'
import { MemberModule } from './member/member.module.js'
import { RLSModule } from './rls/rls.module.js'

@Global()
@Module({
  imports: [RLSModule, FLSModule, MemberModule],
  providers: [AuthzGuard],
  exports: [AuthzGuard],
})
export class AuthzModule {}
