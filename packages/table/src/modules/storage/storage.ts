export interface IPutObject {
  url: string
  id: string
  mimeType: string
  name: string
  token?: string
  size: number
}

export interface IObjectStorage {
  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject>
  get(id: string): Promise<Buffer>
}
