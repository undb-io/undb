import { container } from "@undb/di"
import { env } from "@undb/env"
import { OBJECT_STORAGE } from "@undb/table"
import { LocalObjectStorage } from "./local-object-storage"
import { MinioObjectStorage } from "./minio-object.storaget"
import { S3ObjectStorage } from "./s3-object.storaget"

export const registerStorage = () => {
  container.register(OBJECT_STORAGE, {
    useFactory: () => {
      const provider = env.UNDB_STORAGE_PROVIDER
      if (provider === "minio") {
        return new MinioObjectStorage()
      } else if (provider === "s3") {
        return new S3ObjectStorage()
      }

      return new LocalObjectStorage()
    },
  })
}
