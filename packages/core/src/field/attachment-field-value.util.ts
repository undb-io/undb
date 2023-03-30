import mime from 'mime-types'

export const getExtension = (mimeType: string) => mime.extension(mimeType)
