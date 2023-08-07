import type { IQueryRLS, IRLSCache } from '@undb/authz'
import type { ILogger } from '@undb/logger'
import type { Storage } from 'unstorage'

export class RLSCache implements IRLSCache {
  constructor(
    protected readonly storage: Storage,
    protected readonly logger: ILogger,
  ) {}

  async set(key: string, value: any): Promise<void> {
    await this.storage.setItem(`rls:${key}`, value)
    this.logger.info({ key }, 'setting rls cache')
  }
  async get(key: string): Promise<any> {
    const rls = (await this.storage.getItem(`rls:${key}`)) as IQueryRLS | null
    if (rls) {
      this.logger.info({ key }, 'getting rls cache')
    }
    return rls
  }
  async remove(key: string): Promise<void> {
    await this.storage.removeItem(`rls:${key}`)
    this.logger.info({ key }, 'removing rls cache')
  }
}
