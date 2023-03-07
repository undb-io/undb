import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { providers } from './providers/index.js'

@Module({
  imports: [CqrsModule],
  providers,
})
export class TrpcModule {}
