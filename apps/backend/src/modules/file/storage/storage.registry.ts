import { container } from "@undb/di"
import { OBJECT_STORAGE } from "@undb/table"
import { LocalObjectStorage } from "./local-object-storage"

export const registerStorage = () => {
  container.register(OBJECT_STORAGE, LocalObjectStorage)
}
