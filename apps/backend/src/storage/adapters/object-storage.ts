import type { Readable } from 'stream'

export interface Stat {
  metaData: any
}

export interface IObjectStorage {
  put(buffer: Buffer, originalname: string, mimeType: string): Promise<{ url: string; token: string; id: string }>
  get(name: string): Promise<{ data: Readable; metaData: any }>
}
