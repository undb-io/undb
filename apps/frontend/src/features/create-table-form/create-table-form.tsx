import type { ICreateTableInput } from '@undb/cqrs'
import { useCreateTableMutation } from '@undb/store'
import { Alert, Button, Group, IconAlertCircle, Text, Space, TextInput, Code, Box, ActionIcon, Popover } from '@undb/ui'
import { useNavigate } from 'react-router-dom'

import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateTableAddFieldButton } from './create-table-add-field-button'
import { CreateTableFormSchema } from './create-table-form-schema'
import { DisplayFields } from '../field/display-fields'
import EmojiPicker, { Emoji } from 'emoji-picker-react'
import { DEFAULT_TABLE_EMOJI } from '@undb/core'

interface IProps {
  onCancel: () => void
  onSuccess?: () => void
}

export const CreateTableForm: React.FC<IProps> = ({ onCancel, onSuccess }) => {
  const form = useFormContext<ICreateTableInput>()
  const navigate = useNavigate()

  const [createTable, { isLoading, isError, error, reset: resetCreateTable }] = useCreateTableMutation()

  const onSubmit = form.handleSubmit(async (values) => {
    const data = await createTable(values)
    if ('data' in data) {
      reset()
      navigate(`t/${data.data.id}`)
      onSuccess?.()
    }
  })

  const reset = () => {
    onCancel()
    resetCreateTable()
    form.reset()
  }

  const { t } = useTranslation()

  const displayFields = form.watch('schema').filter((s) => !!s?.display)

  return (
    <form onSubmit={onSubmit}>
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

      <Space h="xs" />

      <Text size="xs" color="gray">
        {t('System fields')}: <Code fw={600}>id</Code> , <Code fw={600}>createdAt</Code> ,{' '}
        <Code fw={600}>updatedAt</Code> .
      </Text>

      <Space h="xs" />

      {!!displayFields.length && (
        <>
          <DisplayFields displayFields={displayFields} />
          <Space h="xs" />
        </>
      )}

      <CreateTableFormSchema />

      <Space h="md" />

      <CreateTableAddFieldButton />

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
        sx={(theme) => ({ borderTop: '1px solid ' + theme.colors.gray[2] })}
      >
        <Group position="right">
          <Button variant="subtle" onClick={() => onCancel()}>
            {t('Cancel', { ns: 'common' })}
          </Button>
          <Button loading={isLoading} miw={200} disabled={!form.formState.isValid} type="submit">
            {t('Create', { ns: 'common' })}
          </Button>
        </Group>
      </Box>
    </form>
  )
}
