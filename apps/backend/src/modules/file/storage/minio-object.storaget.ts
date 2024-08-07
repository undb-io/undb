import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { IObjectStorage, IPresign, IPutObject } from "@undb/table"
import * as Minio from "minio"
import { nanoid } from "nanoid"
import * as path from "node:path"
import { v7 } from "uuid"

@singleton()
export class MinioObjectStorage implements IObjectStorage {
  #minioClient = new Minio.Client({
    endPoint: env.UNDB_MINIO_STORAGE_ENDPOINT!,
    port: env.UNDB_MINIO_STORAGE_PORT,
    region: env.UNDB_MINIO_STORAGE_REGION!,
    accessKey: env.UNDB_MINIO_STORAGE_ACCESS_KEY!,
    secretKey: env.UNDB_MINIO_STORAGE_SECRET_KEY!,
    useSSL: env.UNDB_MINIO_STORAGE_USE_SSL,
  })

  async presign(fileName: string, _path: string, mimeType: string): Promise<IPresign> {
    const id = v7()
    const token = nanoid(16)
    const ext = path.extname(fileName)
    const name = id + ext
    const url = await this.#minioClient.presignedPutObject(env.UNDB_STORAGE_PRIVATE_BUCKET!, name, 24 * 60 * 60)

    return {
      id,
      url,
      token,
      name,
    }
  }

  async getPreviewUrl(fileName: string): Promise<string> {
    return this.#minioClient.presignedGetObject(env.UNDB_STORAGE_PRIVATE_BUCKET!, fileName, 24 * 60 * 60)
  }

  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    throw new Error("Method not implemented.")
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
