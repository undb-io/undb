import { Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import fs from 'node:fs'
import path from 'node:path'
import { v4 } from 'uuid'
import { InjectObjectStorageConfig, objectStorageConfig } from '../../configs/object-storage.js'
import { IObjectStorage } from './object-storage.js'

@Injectable()
export class LocalObjectStorage implements IObjectStorage {
  constructor(@InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>) {}

  async put(buffer: Buffer, originalname: string): Promise<void> {
    const p = this.config.local.path
    const name = v4() + '_' + originalname
    await fs.promises.writeFile(path.join(p, name), buffer)
  }
}
