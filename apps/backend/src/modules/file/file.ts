import { singleton } from "@undb/di"
import { injectObjectStorage, type IObjectStorage } from "@undb/table"
import Elysia, { t } from "elysia"

@singleton()
export class FileService {
  constructor(
    @injectObjectStorage()
    private readonly objectStorage: IObjectStorage,
  ) {}

  async #uploadFile(buffer: Buffer, originalname: string, mimeType: string) {
    return this.objectStorage.put(buffer, originalname, mimeType)
  }

  async #downloadFile(id: string) {
    return this.objectStorage.get(id)
  }

  route() {
    return new Elysia().post(
      "/api/upload",
      async (ctx) => {
        console.log(ctx.body.files)
        for (const file of ctx.body.files) {
          // await this.#uploadFile(file.stream())
        }
      },
      {
        type: "multipart/form-data",
        body: t.Object({
          files: t.Files(),
        }),
      },
    )
  }
}
