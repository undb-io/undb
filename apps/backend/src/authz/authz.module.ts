import { Module } from '@nestjs/common'
import { RLSModule } from './rls/rls.module.js'

@Module({
  imports: [RLSModule],
})
export class AuthzModule {}
