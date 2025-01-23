export interface IPutObject {
  mimeType: string
  name: string
  token?: string
}

export interface IPresign {
  id: string
  token: string
  url: string
  name: string
}

export interface IObjectStorage {
  presign(fileName: string, path: string, mimeType: string): Promise<IPresign> | IPresign
  getPreviewUrl(fileName: string): Promise<string> | string
  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject>
  get(id: string): Promise<Buffer>
}
