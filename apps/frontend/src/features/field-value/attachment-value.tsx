import type { IAttachmentItem } from '@undb/core'
import { isImage } from '@undb/core'
import { getExtension } from '@undb/core'
import type { DefaultExtensionType } from '@undb/ui'
import { Box } from '@undb/ui'
import { Tooltip, Image } from '@undb/ui'
import { FileIcon, defaultStyles } from '@undb/ui'

interface IProps {
  attachment: IAttachmentItem
}

export const AttachmentValue: React.FC<IProps> = ({ attachment }) => {
  const extension = getExtension(attachment.mimeType) as DefaultExtensionType | false
  if (!extension) return null
  if (isImage(attachment)) {
    return (
      <Tooltip label={attachment.name} withinPortal color="blue">
        <Image src={`/public/${attachment.token}_${attachment.name}`} alt={attachment.name} />
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
