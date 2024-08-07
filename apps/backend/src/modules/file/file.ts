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
    return new Elysia()
      .post(
        "/api/signature",
        async (ctx) => {
          const { fileName, mimeType } = ctx.body
          return this.objectStorage.presign(fileName, mimeType)
        },
        {
          type: "json",
          body: t.Object({
            fileName: t.String(),
            mimeType: t.String(),
          }),
        },
      )
      .post(
        "/api/files/:fileName/uploaded",
        async (ctx) => {
          const { fileName } = ctx.params
          const { id, token, url, size, mimeType } = ctx.body
          const signedUrl = await this.objectStorage.getPreviewUrl(fileName)
          await this.qb
            .insertInto("undb_attachment")
            .values({
              id,
              token,
              url,
              size,
              mime_type: mimeType,
              created_at: new Date(),
              created_by: getCurrentUserId(),
              space_id: mustGetCurrentSpaceId(),
              name: fileName,
            })
            .execute()
          return { signedUrl }
        },
        {
          params: t.Object({
            fileName: t.String(),
          }),
          body: t.Object({
            id: t.String(),
            token: t.String(),
            url: t.String(),
            size: t.Number(),
            mimeType: t.String(),
          }),
        },
      )
      .post(
        "/api/tabls/:tableId",
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
