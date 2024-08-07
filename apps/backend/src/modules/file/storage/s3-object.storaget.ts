import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { IObjectStorage, IPresign, IPutObject } from "@undb/table"
import { nanoid } from "nanoid"
import * as path from "node:path"
import { v7 } from "uuid"

@singleton()
export class S3ObjectStorage implements IObjectStorage {
  s3Client = new S3Client({
    credentials: {
      accessKeyId: env.UNDB_S3_ACCESS_KEY_ID!,
      secretAccessKey: env.UNDB_S3_SECRET_ACCESS_KEY!,
    },
    endpoint: env.UNDB_S3_STORAGE_ENDPOINT,
    region: env.UNDB_S3_STORAGE_REGION!,
  })

  async presign(fileName: string, _path: string, mimeType: string): Promise<IPresign> {
    const id = v7()
    const token = nanoid(16)
    const ext = path.extname(fileName)
    const name = id + ext
    const command = new PutObjectCommand({
      Bucket: env.UNDB_STORAGE_PRIVATE_BUCKET,
      Key: name,
    })

    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 24 * 60 * 60 })

    return {
      id,
      url,
      token,
      name,
    }
  }

  async getPreviewUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: env.UNDB_STORAGE_PRIVATE_BUCKET,
      Key: fileName,
    })

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 24 * 60 * 60,
    })
  }

  put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    throw new Error("Method not implemented.")
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
