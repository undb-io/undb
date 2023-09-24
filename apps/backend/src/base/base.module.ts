import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { dbAdapters } from './adapters/index.js'
import { queries } from './queries/index.js'

@Module({
  imports: [CqrsModule],
  providers: [...dbAdapters, ...queries],
})
export class BaseModule {}
