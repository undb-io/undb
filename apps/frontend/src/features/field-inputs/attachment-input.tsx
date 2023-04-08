import type { IAttachmentItem } from '@undb/core'
import { useUploadMutation } from '@undb/store'
import {
  Text,
  Dropzone,
  Group,
  IconUpload,
  IconX,
  IconPhoto,
  useListState,
  AspectRatio,
  Box,
  CloseButton,
  useHover,
} from '@undb/ui'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { AttachmentValue } from '../field-value/attachment-value'
import { useTranslation } from 'react-i18next'

interface IProps {
  value: IAttachmentItem[]
  onChange(items: IAttachmentItem[]): void
}

const AttachmentItem: React.FC<{ attachment: IAttachmentItem; onRemove?: (attachment: IAttachmentItem) => void }> = ({
  attachment,
  onRemove,
}) => {
  const { hovered, ref } = useHover()
  return (
    <Box key={attachment.id} pos="relative" w={60} ref={ref}>
      {hovered && (
        <CloseButton
          variant="filled"
          pos="absolute"
          right={-5}
          top={-3}
          sx={{ zIndex: 1000 }}
          onClick={() => onRemove?.(attachment)}
        />
      )}
      <AspectRatio ratio={1} h="100%" w={60}>
        <AttachmentValue attachment={attachment} />
      </AspectRatio>
    </Box>
  )
}

export const AttachmentInput: React.FC<IProps> = ({ onChange, value = [] }) => {
  const [attachments, handler] = useListState<IAttachmentItem>(value ?? [])
  const [upload, { isLoading }] = useUploadMutation()

  const { t } = useTranslation()

  useDeepCompareEffectNoCheck(() => {
    onChange(attachments)
  }, [attachments])

  useDeepCompareEffectNoCheck(() => {
    if (value) {
      handler.setState(value)
    }
  }, [value])

  return (
    <>
      <Dropzone
        onDrop={async (files) => {
          const formData = new FormData()
          formData.set('file', files[0])
          const data = await upload(formData)
          if (!('error' in data)) {
            handler.append(data.data)
          }
        }}
        loading={isLoading}
      >
        <Group position="center" spacing="xs" style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size="2.0rem" color="gray" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size="2.0rem" color="gray" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size="2.0rem" color="gray" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="md" color="dimmed" inline>
              {t('Drag Or Click', { ns: 'common' })}
            </Text>
          </div>
        </Group>
      </Dropzone>
      {!!attachments.length && (
        <Group h={60}>
          {attachments.map((attachment, index) => (
            <AttachmentItem key={attachment.id} attachment={attachment} onRemove={() => handler.remove(index)} />
          ))}
        </Group>
      )}
    </>
  )
}
