import type { IFLSCache, IQueryFLS } from '@undb/authz'
import type { ILogger } from '@undb/logger'
import type { Storage } from 'unstorage'

export class FLSCache implements IFLSCache {
  constructor(
    protected readonly storage: Storage,
    protected readonly logger: ILogger,
  ) {}

  async set(key: string, value: any): Promise<void> {
    await this.storage.setItem(`rls:${key}`, value)
    this.logger.info({ key }, 'setting rls cache')
  }
  async get(key: string): Promise<any> {
    const fls = (await this.storage.getItem(`rls:${key}`)) as IQueryFLS | null
    if (fls) {
      this.logger.info({ key }, 'getting rls cache')
    }
    return fls
  }
  async remove(key: string): Promise<void> {
    await this.storage.removeItem(`rls:${key}`)
    this.logger.info({ key }, 'removing rls cache')
  }
}
