import { getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import { singleton } from "@undb/di"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence"
import {
  injectObjectStorage,
  injectTableRepository,
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
              created_at: new Date(),
              created_by: getCurrentUserId(),
              space_id: mustGetCurrentSpaceId(),
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
            file: t.File(),
          }),
        },
      )
  }
}
