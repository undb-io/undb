import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters'
import { commandHandlers } from './commands'
import { restfulControllers } from './ports/restful'

@Module({
  imports: [CqrsModule],
  controllers: [...restfulControllers],
  providers: [...commandHandlers, ...dbAdapters],
})
export class TableModule {}
