export interface IObjectStorage {
  put(buffer: Buffer, originalname: string): Promise<void>
}
