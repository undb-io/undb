import { container } from "@undb/di"
import { env } from "@undb/env"
import { OBJECT_STORAGE } from "@undb/table"
import { LocalObjectStorage } from "./local-object-storage"
import { MinioObjectStorage } from "./minio-object.storaget"

export const registerStorage = () => {
  container.register(OBJECT_STORAGE, {
    useFactory: () => {
      const provider = env.UNDB_STORAGE_PROVIDER
      if (provider === "minio") {
        return new MinioObjectStorage()
      }

      return new LocalObjectStorage()
    },
  })
}
