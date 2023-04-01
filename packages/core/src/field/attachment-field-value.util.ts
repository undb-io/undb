import mime from 'mime-types'
import type { IAttachmentItem } from './attachment-field.type'

export const getExtension = (mimeType: string) => mime.extension(mimeType)

export const isImage = (attachment: IAttachmentItem) => attachment.mimeType.startsWith('image')

export const getMimeType = (attachment: IAttachmentItem) => attachment.mimeType.split('/')[0]
