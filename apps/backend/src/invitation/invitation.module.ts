import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...commands, ...queries, ...adapters],
})
export class InvitationModule {}
