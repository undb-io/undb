import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { IObjectStorage, IPresign, IPutObject } from "@undb/table"
import { nanoid } from "nanoid"
import * as path from "node:path"
import { v7 } from "uuid"

@singleton()
export class LocalObjectStorage implements IObjectStorage {
  async presign(fileName: string, _path: string, mimeType: string): Promise<IPresign> {
    const id = v7()
    const token = nanoid(16)
    const ext = path.extname(fileName)
    const name = id + ext

    const url = "/api/upload"

    return {
      id,
      url,
      token,
      name,
    }
  }
  async getPreviewUrl(fileName: string): Promise<string> {
    return env.UNDB_BASE_URL + "/public/" + fileName
  }
  async put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    await Bun.write(`./.undb/storage/${path ? path + "/" : ""}${originalname}`, buffer)

    return {
      mimeType,
      name: originalname,
    }
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
