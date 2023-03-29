import { useUploadMutation } from '@egodb/store'
import { Text, Dropzone, Group, IconUpload, IconX, IconPhoto } from '@egodb/ui'

export const AttachmentInput: React.FC = () => {
  const [upload, { isLoading }] = useUploadMutation()

  return (
    <Dropzone
      onDrop={(files) => {
        const formData = new FormData()
        formData.set('file', files[0])
        upload(formData)
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
