import { Inject, Injectable } from '@nestjs/common'
import { FLSCache } from '@undb/cache'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { type Storage } from 'unstorage'
import { InjectStorage } from '../../../cache/storage.provider.js'

export const FLS_CACHE = Symbol('FLS_CACHE')

export const InjectFLSCache = () => Inject(FLS_CACHE)

@Injectable()
export class NestFLSKVCache extends FLSCache {
  constructor(
    @InjectStorage()
    protected readonly storage: Storage,
    @InjectPinoLogger(NestFLSKVCache.name)
    protected readonly logger: PinoLogger,
  ) {
    super(storage, logger)
  }
}
