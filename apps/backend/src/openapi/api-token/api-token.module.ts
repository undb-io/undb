import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { adapters } from './adapters/index.js'
import { commandHandlers } from './commands/index.js'
import { queryHandlers } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...adapters, ...commandHandlers, ...queryHandlers],
  exports: [...adapters],
})
export class ApiTokenModule {}
