import { Injectable } from '@nestjs/common'
import { ShareGuardService, type IShareRepository } from '@undb/integrations'
import { InjectShareRepository } from '../adapters/share-sqlite.repository.js'

@Injectable()
export class NestShareGuardService extends ShareGuardService {
  constructor(@InjectShareRepository() repo: IShareRepository) {
    super(repo)
  }
}
