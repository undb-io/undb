import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3"
import { container, inject, instanceCachingFactory, singleton } from "@undb/di"
import { env } from "@undb/env"
import { IObjectStorage, IPutObject } from "@undb/table"
import { v7 } from "uuid"

const S3_CLIENT = Symbol("S3_CLIENT")

container.register(S3_CLIENT, {
  useFactory: instanceCachingFactory(async () => {
    const S3Client = (await import("@aws-sdk/client-s3")).S3Client
    return new S3Client({
      region: env.UNDB_MINIO_STORAGE_REGION!,
      credentials: {
        accessKeyId: env.UNDB_MINIO_STORAGE_ACCESS_KEY!,
        secretAccessKey: env.UNDB_MINIO_STORAGE_SECRET_KEY!,
      },
      endpoint: env.UNDB_MINIO_STORAGE_ENDPOINT,
    })
  }),
})

@singleton()
export class S3ObjectStorage implements IObjectStorage {
  constructor(@inject(S3_CLIENT) private readonly s3Client: S3Client) {}

  async put(buffer: Buffer, path: string, originalname: string, mimeType: string): Promise<IPutObject> {
    const id = v7()
    const name = id + "_" + originalname
    const output = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: env.UNDB_MINIO_STORAGE_BUCKET!,
        Key: name,
        Body: buffer,
        Metadata: {
          "Content-Type": mimeType,
        },
      }),
    )

    return {
      id: id,
      name: originalname,
      size: buffer.length,
      mimeType: mimeType,
      url: `/api/attachment/${name}`,
      token: output.ETag,
    }
  }
  get(id: string): Promise<Buffer> {
    throw new Error("Method not implemented.")
  }
}
