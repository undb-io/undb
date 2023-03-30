import type { IAttachmentItem } from '@egodb/core'
import { useUploadMutation } from '@egodb/store'
import { Text, Dropzone, Group, IconUpload, IconX, IconPhoto, useListState } from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IProps {
  value: IAttachmentItem[]
  onChange(items: IAttachmentItem[]): void
}

export const AttachmentInput: React.FC<IProps> = ({ onChange }) => {
  const [attachments, handler] = useListState<IAttachmentItem>([])
  const [upload, { isLoading }] = useUploadMutation()

  useDeepCompareEffect(() => {
    onChange(attachments)
  }, [attachments])

  return (
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
          <IconUpload size="3.2rem" stroke={1.5} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size="3.2rem" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}
