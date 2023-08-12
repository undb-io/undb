import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { NestInvitationService } from './invitation.service.js'
import { queries } from './queries/index.js'
import { sagas } from './sagas/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...commands, ...queries, ...sagas, ...adapters, NestInvitationService],
})
export class InvitationModule {}
