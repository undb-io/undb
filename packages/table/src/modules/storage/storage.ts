export interface IPutObject {
  url: string
  id: string
  mimeType: string
}

export interface IObjectStorage {
  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject>
  get(id: string): Promise<Buffer>
}
