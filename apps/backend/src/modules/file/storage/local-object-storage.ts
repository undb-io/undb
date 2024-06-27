import { singleton } from "@undb/di"
import { IObjectStorage, IPutObject } from "@undb/table"

@singleton()
export class LocalObjectStorage implements IObjectStorage {
  async put(buffer: Buffer, originalname: string, mimeType: string): Promise<IPutObject> {
    const path = `./.undb/storage/${originalname}`
    await Bun.write(path, buffer)

    return {
      url: "/public/" + originalname,
    }
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
