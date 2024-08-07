import { container } from "@undb/di"
import { OBJECT_STORAGE } from "@undb/table"
import { MinioObjectStorage } from "./minio-object.storaget"

export const registerStorage = () => {
  container.register(OBJECT_STORAGE, MinioObjectStorage)
}
