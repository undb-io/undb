import { Injectable } from '@nestjs/common'
import { TableCache } from '@undb/cache'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { type Storage } from 'unstorage'
import { InjectStorage } from '../../../../cache/storage.provider.js'

@Injectable()
export class NestTableKVCache extends TableCache {
  constructor(
    @InjectStorage()
    protected readonly storage: Storage,
    @InjectPinoLogger(NestTableKVCache.name)
    protected readonly logger: PinoLogger,
  ) {
    super(storage, logger)
  }
}
