import { Inject, Injectable } from '@nestjs/common'
import { TableCache } from '@undb/cache'
import type { Storage } from 'unstorage'

export const STORAGE = Symbol('STORAGE')
export const InjectStorage = () => Inject(STORAGE)

@Injectable()
export class NestTableKVCache extends TableCache {
  constructor(
    @InjectStorage()
    protected readonly storage: Storage,
  ) {
    super(storage)
  }
}
