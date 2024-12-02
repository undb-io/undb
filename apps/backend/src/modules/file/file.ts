import { type IContext, injectContext } from "@undb/context"
import { singleton } from "@undb/di"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence/server"
import { injectObjectStorage, type IObjectStorage, type IPutObject } from "@undb/table"
import Elysia, { t } from "elysia"

@singleton()
export class FileService {
  constructor(
    @injectObjectStorage()
    private readonly objectStorage: IObjectStorage,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectContext()
    private readonly context: IContext,
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
          return this.objectStorage.presign(fileName, "", mimeType)
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
              created_at: new Date().getTime(),
              created_by: this.context.mustGetCurrentUserId(),
              space_id: this.context.mustGetCurrentSpaceId(),
              name: fileName,
            })
            .execute()
          return { signedUrl }
        },
        {
          type: "json",
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
      .put(
        "/api/upload",
        async (ctx) => {
          const responses: IPutObject[] = []
          const file = ctx.body.file
          const name = ctx.body.name
          const arrayBuffer = await file.arrayBuffer()
          const response = await this.#uploadFile(Buffer.from(arrayBuffer), "", name, file.type)

          responses.push(response)

          return responses
        },
        {
          type: "multipart/form-data",
          body: t.Object({
            name: t.String(),
            file: t.File({ maxSize: "100m" }),
          }),
        },
      )
  }
}
