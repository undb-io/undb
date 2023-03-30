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

  get #path() {
    const now = new Date()
    return path.join(
      this.config.local.path,
      now.getFullYear().toString(),
      (now.getMonth() + 1).toString(),
      now.getDate().toString(),
    )
  }

  async #getPath(name: string) {
    const p = this.#path
    await fs.promises.mkdir(p, { recursive: true })
    return path.join(p, name)
  }

  async put(buffer: Buffer, originalname: string): Promise<void> {
    const name = v4() + '_' + originalname
    await fs.promises.writeFile(await this.#getPath(name), buffer)
  }
}
