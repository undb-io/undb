import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { IObjectStorage, IPresign, IPutObject } from "@undb/table"
import { S3Client } from "bun"
import { nanoid } from "nanoid"
import * as path from "node:path"
import { v7 } from "uuid"

@singleton()
export class S3ObjectStorage implements IObjectStorage {
  s3Client = new S3Client({
    accessKeyId: env.UNDB_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.UNDB_S3_SECRET_ACCESS_KEY!,
    endpoint: env.UNDB_S3_STORAGE_ENDPOINT,
    region: env.UNDB_S3_STORAGE_REGION!,
  })

  presign(fileName: string, _path: string, mimeType: string): IPresign {
    const id = v7()
    const token = nanoid(16)
    const ext = path.extname(fileName)
    const name = id + ext

    const url = this.s3Client.presign(name, { bucket: env.UNDB_STORAGE_PRIVATE_BUCKET, expiresIn: 24 * 60 * 60 })

    return {
      id,
      url,
      token,
      name,
    }
  }

  getPreviewUrl(fileName: string): string {
    return this.s3Client.presign(fileName, { bucket: env.UNDB_STORAGE_PRIVATE_BUCKET, expiresIn: 24 * 60 * 60 })
  }

  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    throw new Error("Method not implemented.")
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
