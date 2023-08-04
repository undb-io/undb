import { Module } from '@nestjs/common'
import { storage } from './storage.provider.js'

@Module({
  providers: [storage],
  exports: [storage],
})
export class CacheModule {}
