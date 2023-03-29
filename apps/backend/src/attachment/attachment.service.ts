import { Injectable } from '@nestjs/common'
import type { IObjectStorage } from './adapters/object-storage.js'
import { InjectObjectStorage } from './adapters/provider.js'

@Injectable()
export class AttachmentService {
  constructor(@InjectObjectStorage() private readonly storage: IObjectStorage) {}

  public async uploadFile(buffer: Buffer, originalname: string) {
    await this.storage.put(buffer, originalname)
  }
}
