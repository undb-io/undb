import { Injectable } from '@nestjs/common'
import { IObjectStorage } from './object-storage.js'

@Injectable()
export class LocalObjectStorage implements IObjectStorage {
  put(): Promise<void> {
    throw new Error('[LocalObjectStorage.put] Method not implemented.')
  }
}
