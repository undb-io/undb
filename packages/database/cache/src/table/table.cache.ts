import type { IQueryTable, ITableCache } from '@undb/core'
import type { Storage } from 'unstorage'

export class TableCache implements ITableCache {
  constructor(protected readonly storage: Storage) {}

  async set(key: string, value: IQueryTable): Promise<void> {
    await this.storage.setItem(`table:${key}`, value)
  }

  async get(key: string): Promise<IQueryTable | null> {
    const table = (await this.storage.getItem(`table:${key}`)) as IQueryTable | null
    return table
  }

  async remove(key: string): Promise<void> {
    await this.storage.removeItem(`table:${key}`)
  }
}
