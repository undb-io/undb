import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { commandHandlers } from './commands'
import { httpControllers } from './ports'

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [...commandHandlers],
})
export class TableModule {}
