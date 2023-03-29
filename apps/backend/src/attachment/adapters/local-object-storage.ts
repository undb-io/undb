import { Injectable } from '@nestjs/common'
import fs from 'node:fs'
import path from 'node:path'
import { v4 } from 'uuid'
import { IObjectStorage } from './object-storage.js'

@Injectable()
export class LocalObjectStorage implements IObjectStorage {
  async put(buffer: Buffer, originalname: string): Promise<void> {
    const p = path.resolve(process.cwd(), './attachments/')
    const name = v4() + '_' + originalname
    await fs.promises.writeFile(path.join(p, name), buffer)
  }
}
