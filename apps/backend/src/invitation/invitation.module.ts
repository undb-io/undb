import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...commands, ...adapters],
})
export class InvitationModule {}
