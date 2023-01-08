import { config } from '@egodb/sqlite'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/in-memory'
import { commandHandlers } from './commands'
import { queryHandlers } from './queries'

@Module({
  imports: [CqrsModule, MikroOrmModule.forRoot(config)],
  providers: [...commandHandlers, ...queryHandlers, ...dbAdapters],
})
export class TableModule {}
