import { singleton } from "@undb/di"
import { IObjectStorage, IPutObject } from "@undb/table"
import { v4 } from "uuid"

@singleton()
export class LocalObjectStorage implements IObjectStorage {
  async put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    const id = v4()
    await Bun.write(`./.undb/storage/${path}/${id}-${originalname}`, buffer)

    return {
      url: "/public/" + path + "/" + `${id}-${originalname}`,
      id,
      mimeType,
    }
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
