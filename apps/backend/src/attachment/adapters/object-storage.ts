export interface IObjectStorage {
  put(buffer: Buffer, originalname: string): Promise<{ token: string; id: string }>
}
