import { None, Option, Some } from "@undb/domain"
import { z } from "@undb/zod"
import type { IDuplicateViewDTO } from "../../../../dto/duplicate-view.dto"
import { WithNewView, WithView } from "../../../../specifications/table-view.specification"
import type { TableDo } from "../../../../table.do"
import { fieldId } from "../../../schema/fields/field-id.vo"
import { ViewIdVo } from "../view-id.vo"
import { AbstractView, baseViewDTO, createBaseViewDTO, updateBaseViewDTO } from "./abstract-view.vo"

export const GALLERY_TYPE = "gallery" as const

export const galleryOption = z.object({
  field: fieldId.optional(),
})

export type IGalleryOption = z.infer<typeof galleryOption>

export const createGalleryViewDTO = createBaseViewDTO.extend({
  type: z.literal(GALLERY_TYPE),
  gallery: galleryOption.optional(),
})

export type ICreateGalleryViewDTO = z.infer<typeof createGalleryViewDTO>

export const galleryViewDTO = baseViewDTO.extend({
  type: z.literal(GALLERY_TYPE),
  gallery: galleryOption.optional(),
})

export type IGalleryViewDTO = z.infer<typeof galleryViewDTO>

export const updateGalleryViewDTO = updateBaseViewDTO.merge(
  z.object({
    type: z.literal(GALLERY_TYPE),
    gallery: galleryOption.optional(),
  }),
)

export type IUpdateGalleryViewDTO = z.infer<typeof updateGalleryViewDTO>

export class GalleryView extends AbstractView {
  gallery: Option<IGalleryOption> = None

  get field() {
    return this.gallery.map((x) => x.field)
  }

  constructor(table: TableDo, dto: IGalleryViewDTO) {
    super(table, dto)
    this.gallery = Option(dto.gallery)
  }

  static create(table: TableDo, dto: ICreateGalleryViewDTO) {
    const fields = table.getOrderedFields()
    return new GalleryView(table, {
      ...dto,
      id: ViewIdVo.fromStringOrCreate(dto.id).value,
      fields: fields.map((f, index) => ({ fieldId: f.id.value, hidden: index > 5 })),
    })
  }

  override type = GALLERY_TYPE

  override $update(table: TableDo, input: IUpdateGalleryViewDTO): Option<WithView> {
    const json = this.toJSON()
    const view = new GalleryView(table, {
      ...json,
      name: input.name,
      id: this.id.value,
      type: GALLERY_TYPE,
      gallery: input.gallery ?? this.gallery.into(undefined),
    })

    return Some(new WithView(this, view))
  }

  override $duplicate(table: TableDo, dto: IDuplicateViewDTO): Option<WithNewView> {
    const json = this.toJSON()

    return Some(
      new WithNewView(
        new GalleryView(table, {
          ...json,
          name: dto.name,
          gallery: this.gallery.into(undefined),
          isDefault: false,
          id: ViewIdVo.create().value,
          type: GALLERY_TYPE,
        }),
      ),
    )
  }

  toJSON() {
    return { ...super.toJSON(), gallery: this.gallery.into(undefined) }
  }
}
