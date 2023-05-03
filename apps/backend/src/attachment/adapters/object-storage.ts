export interface IObjectStorage {
  put(buffer: Buffer, originalname: string): Promise<{ url: string; token: string; id: string }>
}
