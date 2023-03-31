import type { IAttachmentItem } from '@egodb/core'
import { isImage } from '@egodb/core'
import { getExtension } from '@egodb/core'
import type { DefaultExtensionType } from '@egodb/ui'
import { Box } from '@egodb/ui'
import { Tooltip, Image } from '@egodb/ui'
import { FileIcon, defaultStyles } from '@egodb/ui'

interface IProps {
  attachment: IAttachmentItem
}

export const AttachmentValue: React.FC<IProps> = ({ attachment }) => {
  const extension = getExtension(attachment.mimeType) as DefaultExtensionType | false
  if (!extension) return null
  if (isImage(attachment)) {
    return (
      <Tooltip label={attachment.name} withinPortal color="blue">
        <Image src={`http://localhost:4000/${attachment.token}_${attachment.name}`} alt={attachment.name} />
      </Tooltip>
    )
  }
  return (
    <Tooltip label={attachment.name} withinPortal color="blue">
      <Box>
        <FileIcon extension={extension} {...(defaultStyles?.[extension] ?? {})} />
      </Box>
    </Tooltip>
  )
}
