import type { IQueryTable, ITableCache } from '@undb/core'
import type { ILogger } from '@undb/logger'
import type { Storage } from 'unstorage'

export class TableCache implements ITableCache {
  constructor(protected readonly storage: Storage, protected readonly logger: ILogger) {}

  async set(key: string, value: IQueryTable): Promise<void> {
    await this.storage.setItem(`table:${key}`, value)
    this.logger.info({ key }, 'setting table cache')
  }

  async get(key: string): Promise<IQueryTable | null> {
    const table = (await this.storage.getItem(`table:${key}`)) as IQueryTable | null
    if (table) {
      this.logger.info({ key }, 'getting table cache')
    }
    return table
  }

  async remove(key: string): Promise<void> {
    await this.storage.removeItem(`table:${key}`)
    this.logger.info({ key }, 'removing table cache')
  }
}
