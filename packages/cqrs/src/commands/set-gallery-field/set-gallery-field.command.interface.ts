import type { z } from 'zod'
import type { setGalleryFieldCommandInput } from './set-gallery-field.command.input.js'

export type ISetGalleryFieldCommandInput = z.infer<typeof setGalleryFieldCommandInput>
