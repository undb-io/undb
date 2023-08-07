import { Inject, Injectable } from '@nestjs/common'
import { RLSCache } from '@undb/cache'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { type Storage } from 'unstorage'
import { InjectStorage } from '../../../cache/storage.provider.js'

export const RLS_CACHE = Symbol('RLS_CACHE')

export const InjectRLSCache = () => Inject(RLS_CACHE)

@Injectable()
export class NestRLSKVCache extends RLSCache {
  constructor(
    @InjectStorage()
    protected readonly storage: Storage,
    @InjectPinoLogger(NestRLSKVCache.name)
    protected readonly logger: PinoLogger,
  ) {
    super(storage, logger)
  }
}
