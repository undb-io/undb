import { z } from "zod";
import { ViewIdVo,viewId,type ViewId } from "../view-id.vo";
import { ViewNameVo,viewName } from "../view-name.vo";
import type { ViewType } from "../view.type";

export const createBaseViewDTO = z.object({
  id: viewId.optional(),
  name: viewName,
})

export type ICreateBaseViewDTO = z.infer<typeof createBaseViewDTO>

export const baseViewDTO = z.object({
  id: viewId,
  name: viewName,
})

export type IBaseViewDTO = z.infer<typeof baseViewDTO>

export abstract class AbstractView {
	id!: ViewId
	name!: ViewNameVo

	abstract type: ViewType

	constructor(dto: IBaseViewDTO) {
		this.id = new ViewIdVo(dto.id)
		this.name = new ViewNameVo(dto.name)
	}

	toJSON() {
		return {
			id: this.id.value,
			name: this.name.value,
			type: this.type
		}
	}
}