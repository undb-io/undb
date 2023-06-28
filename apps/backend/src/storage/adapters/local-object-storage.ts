import { Injectable } from '@nestjs/common'
import { type ConfigType } from '@nestjs/config'
import fs from 'node:fs'
import path from 'node:path'
import type { Readable } from 'node:stream'
import { v4 } from 'uuid'
import type { objectStorageConfig } from '../../configs/object-storage.config.js'
import { InjectObjectStorageConfig } from '../../configs/object-storage.config.js'
import type { IObjectStorage, Stat } from './object-storage.js'

@Injectable()
export class LocalObjectStorage implements IObjectStorage {
  constructor(@InjectObjectStorageConfig() private readonly config: ConfigType<typeof objectStorageConfig>) {}
  get #nestedPath() {
    const now = new Date()
    return path.join(now.getFullYear().toString(), (now.getMonth() + 1).toString(), now.getDate().toString())
  }

  async #getPath(nestedPath: string) {
    const p = path.join(this.config.local.path, nestedPath)
    await fs.promises.mkdir(p, { recursive: true })
    return p
  }

  #getFull(p: string, token: string, name: string) {
    return path.join(p, token + '_' + name)
  }

  async put(
    buffer: Buffer,
    originalname: string,
    mimetype: string,
  ): Promise<{ url: string; token: string; id: string }> {
    const nestedPath = this.#nestedPath
    const p = await this.#getPath(nestedPath)
    const id = v4()
    const token = path.join(nestedPath, id)
    const full = this.#getFull(p, id, originalname)
    await fs.promises.writeFile(full, buffer)

    const url = `/public/${token}_${originalname}`
    return { token, id, url }
  }

  get(name: string): Promise<{ data: Readable; metaData: any }> {
    throw new Error('Method not implemented.')
  }

  // TODO: file stream
  stat(name: string): Promise<Stat> {
    throw new Error('Method not implemented.')
  }
}
