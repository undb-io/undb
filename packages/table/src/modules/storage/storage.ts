export interface IPutObject {
  url: string
  token: string
  id: string
}

export interface IObjectStorage {
  put(buffer: Buffer, originalname: string, mimeType: string): Promise<IPutObject>
  get(id: string): Promise<Buffer>
}
