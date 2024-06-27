import { singleton } from "@undb/di"
import {
  IPutObject,
  TableIdVo,
  injectObjectStorage,
  injectTableRepository,
  type IObjectStorage,
  type ITableRepository,
} from "@undb/table"
import Elysia, { t } from "elysia"
import { v4 } from "uuid"

@singleton()
export class FileService {
  constructor(
    @injectObjectStorage()
    private readonly objectStorage: IObjectStorage,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
  ) {}

  async #uploadFile(buffer: Buffer, originalname: string, mimeType: string) {
    return this.objectStorage.put(buffer, originalname, mimeType)
  }

  async #downloadFile(id: string) {
    return this.objectStorage.get(id)
  }

  route() {
    return new Elysia().post(
      "/api/upload/:tableId",
      async (ctx) => {
        const tableId = new TableIdVo(ctx.params.tableId)
        const table = (await this.tableRepository.findOneById(tableId)).unwrap()

        const responses: IPutObject[] = []
        for (const file of ctx.body.files) {
          const arrayBuffer = await file.arrayBuffer()
          const response = await this.#uploadFile(
            Buffer.from(arrayBuffer),
            `${table.baseId}/${table.id.value}/${v4()}-${file.name}`,
            file.type,
          )

          responses.push(response)
        }

        return responses
      },
      {
        type: "multipart/form-data",
        params: t.Object({
          tableId: t.String(),
        }),
        body: t.Object({
          files: t.Files(),
        }),
      },
    )
  }
}
