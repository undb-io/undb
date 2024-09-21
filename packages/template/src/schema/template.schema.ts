import zodToJsonSchema from "zod-to-json-schema"
import { templateDTO } from "../dto/template.dto"

export const templateSchema = zodToJsonSchema(templateDTO, {
  errorMessages: true,
})
