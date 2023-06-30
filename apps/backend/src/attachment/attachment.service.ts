import { Injectable } from '@nestjs/common'
import type { Readable } from 'stream'
import { type IObjectStorage } from '../storage/adapters/object-storage.js'
import { InjectObjectStorage } from '../storage/adapters/provider.js'

@Injectable()
export class AttachmentService {
  constructor(@InjectObjectStorage() private readonly storage: IObjectStorage) {}

  public async uploadFile(
    buffer: Buffer,
    originalname: string,
    mimetype: string,
  ): Promise<{ url: string; token: string; id: string }> {
    return this.storage.put(buffer, originalname, mimetype)
  }

  public async get(name: string): Promise<{ data: Readable; metaData: any }> {
    const { data, metaData } = await this.storage.get(name)
    return { data, metaData }
  }
}
