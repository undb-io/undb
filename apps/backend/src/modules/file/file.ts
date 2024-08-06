import { getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import { singleton } from "@undb/di"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence"
import {
  injectObjectStorage,
  injectTableRepository,
  TableIdVo,
  type IObjectStorage,
  type IPutObject,
  type ITableRepository,
} from "@undb/table"
import Elysia, { t } from "elysia"

@singleton()
export class FileService {
  constructor(
    @injectObjectStorage()
    private readonly objectStorage: IObjectStorage,
    @injectTableRepository()
    private readonly tableRepository: ITableRepository,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async #uploadFile(buffer: Buffer, path: string, originalname: string, mimeType: string) {
    return this.objectStorage.put(buffer, path, originalname, mimeType)
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
            `${table.baseId}/${table.id.value}`,
            file.name,
            file.type,
          )

          responses.push({ ...response, size: file.size })
        }

        const userId = getCurrentUserId()
        const spaceId = mustGetCurrentSpaceId()

        await this.qb
          .insertInto("undb_attachment")
          .values(
            responses.map((response) => {
              return {
                id: response.id,
                mime_type: response.mimeType,
                name: response.name,
                token: response.token,
                url: response.url,
                created_at: new Date(),
                created_by: userId,
                size: response.size,
                space_id: spaceId,
              }
            }),
          )
          .execute()

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
