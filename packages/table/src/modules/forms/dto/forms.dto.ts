import type { z } from "@undb/zod"
import { formDTO } from "../form/form.vo"

export const formsDTO = formDTO.array()

export type IFormsDTO = z.infer<typeof formsDTO>
