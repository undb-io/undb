import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { UserModule } from '../core/user/user.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { InvitationMailService } from './invitation-mail.service.js'
import { InvitationController } from './invitation.controller.js'
import { NestInvitationService } from './invitation.service.js'
import { queries } from './queries/index.js'
import { sagas } from './sagas/index.js'

@Module({
  imports: [CqrsModule, UserModule],
  controllers: [InvitationController],
  providers: [...commands, ...queries, ...sagas, ...adapters, NestInvitationService, InvitationMailService],
})
export class InvitationModule {}
