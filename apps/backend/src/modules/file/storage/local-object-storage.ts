import { singleton } from "@undb/di"
import { IObjectStorage, IPutObject } from "@undb/table"

@singleton()
export class LocalObjectStorage implements IObjectStorage {
  async put(buffer: Buffer, originalname: string, mimeType: string): Promise<IPutObject> {
    await Bun.write(originalname, buffer)
    throw new Error("Method not implemented.")
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
