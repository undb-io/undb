export interface IPutObject {
  url: string
  id: string
  mimeType: string
  name: string
  token?: string
  size: number
}

export interface IPresign {
  id: string
  token: string
  url: string
  name: string
}

export interface IObjectStorage {
  presign(fileName: string, mimeType: string): Promise<IPresign>
  getPreviewUrl(fileName: string): Promise<string>
  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject>
  get(id: string): Promise<Buffer>
}
