import { DEFAULT_TABLE_EMOJI, type IUpdateTableSchema } from '@undb/core'
import { useUpdateTableMutation } from '@undb/store'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Divider,
  Group,
  IconAlertCircle,
  Popover,
  Stack,
  Text,
  TextInput,
} from '@undb/ui'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useCurrentTable } from '../../hooks/use-current-table'
import EmojiPicker, { Emoji } from 'emoji-picker-react'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const UpdateTableForm: React.FC<IProps> = ({ onCancel, onSuccess: success }) => {
  const table = useCurrentTable()
  const form = useFormContext<IUpdateTableSchema>()

  const [updateTable, { reset: resetUpdateTable, isLoading, isError, error }] = useUpdateTableMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    await updateTable({ id: table.id.value, ...values })
    reset()
    success?.()
  })

  const reset = () => {
    onCancel()
    resetUpdateTable()
    form.reset()
  }

  const { t } = useTranslation()

  const disabled = !form.formState.isValid || !form.formState.isDirty

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group>
          <Popover>
            <Popover.Target>
              <ActionIcon mb={10} size="xs" sx={{ alignSelf: 'end' }}>
                <Emoji size={20} unified={form.watch('emoji') ?? DEFAULT_TABLE_EMOJI} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Controller
                name="emoji"
                render={(form) => <EmojiPicker onEmojiClick={(emoji) => form.field.onChange(emoji.unified)} />}
              />
            </Popover.Dropdown>
          </Popover>
          <TextInput
            error={form.formState.errors['name']?.message}
            label={
              <Text size={14} fw={700} display="inline-block">
                {t('Name', { ns: 'common' })}
              </Text>
            }
            {...form.register('name')}
            required={true}
            sx={{ flex: 1 }}
          />
        </Group>

        <Divider />
        {isError && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} title="Oops! Create Table Error!" mt="lg">
            {(error as any).message}
          </Alert>
        )}
        <Box
          pos="fixed"
          bottom={0}
          right={0}
          w="100%"
          p="md"
          bg="white"
          sx={(theme) => ({ zIndex: 1000, borderTop: '1px solid ' + theme.colors.gray[2] })}
        >
          <Group position="right">
            <Button variant="subtle" onClick={() => onCancel()}>
              {t('Cancel', { ns: 'common' })}
            </Button>
            <Button loading={isLoading} miw={200} disabled={disabled} type="submit">
              {t('Update', { ns: 'common' })}
            </Button>
          </Group>
        </Box>
      </Stack>
    </form>
  )
}
