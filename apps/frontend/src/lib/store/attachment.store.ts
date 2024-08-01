import type { IAttachmentFieldValueItem } from "@undb/table"
import { writable } from "svelte/store"

export const selectedAttachment = writable<IAttachmentFieldValueItem | null>(null)
