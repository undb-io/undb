<script lang="ts">
  import * as Form from '$lib/components/ui/form'
  import * as Select from '$lib/components/ui/select/index.js'
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label'
  import { trpc } from '$lib/trpc/client.js'
  import { createMutation, useQueryClient } from '@tanstack/svelte-query'
  import SuperDebug, { superForm, defaults } from 'sveltekit-superforms'
  import { createWebhookCommand, type ICreateWebhookCommand } from '@undb/commands'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { Input } from '$lib/components/ui/input'
  import { toast } from 'svelte-sonner'
  import { getTable } from '$lib/store/table.store'
  import FiltersEditor from '../filters-editor/filters-editor.svelte'
  import { type MaybeConditionGroup, parseValidViewFilter } from '@undb/table'
  import { writable } from 'svelte/store'
  import { closeModal, CREATE_WEBHOOK_MODAL } from '$lib/store/modal.store'
  import type { IWebhookConditionOptionSchema } from '@undb/webhook'
  import { LL } from '@undb/i18n/client'

  const table = getTable()

  const client = useQueryClient()
  const createWebhookMutation = createMutation({
    mutationFn: trpc.webhook.create.mutate,
    async onSuccess(data) {
      form.reset()
      closeModal(CREATE_WEBHOOK_MODAL)
      await client.invalidateQueries({
        queryKey: ['tables', $table.id.value, 'webhooks'],
      })
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  const form = superForm<ICreateWebhookCommand>(
    defaults(
      {
        name: 'webhook',
        method: 'POST',
        url: '',
        tableId: $table.id.value,
        enabled: true,
        headers: {},
        event: 'record.created',
      },
      zodClient(createWebhookCommand),
    ),
    {
      SPA: true,
      dataType: 'json',
      validators: zodClient(createWebhookCommand),
      resetForm: false,
      invalidateAll: true,
      onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        $createWebhookMutation.mutate(event.form.data)
      },
    },
  )

  const { form: formData, enhance, allErrors } = form

  const condition = writable<MaybeConditionGroup<any> | undefined>()
  $: validCondition = $condition ? parseValidViewFilter($table.schema, $condition) : undefined
  $: validCondition,
    formData.update(($form) => {
      $form.condition = validCondition
      return $form
    })

  $: selectedMethod = $formData.method
    ? {
        label: $formData.method,
        value: $formData.method,
      }
    : undefined

  $: selectedEvent = $formData.event
    ? {
        label: $formData.event,
        value: $formData.event,
      }
    : undefined

  let enableCondition = false

  $: disabled = !!$allErrors.length
</script>

<form id="createWebhook" class="grid gap-3 px-1" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control let:attrs>
      <Form.Label>{$LL.common.name()}</Form.Label>
      <Input {...attrs} bind:value={$formData.name} placeholder={$LL.common.name()} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Label>URL</Label>
  <div class="flex w-full items-center justify-center gap-2">
    <Form.Field {form} name="method">
      <Form.Control let:attrs>
        <Select.Root
          selected={selectedMethod}
          onSelectedChange={(v) => {
            v && ($formData.method = v.value)
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder={$LL.common.select()} />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="POST" label="POST" />
            <Select.Item value="PATCH" label="PATCH" />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.method} name={attrs.name} />
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="url" class="flex flex-1 items-center">
      <Form.Control let:attrs>
        <Input {...attrs} bind:value={$formData.url} type="url" placeholder="http://example.com/webhook" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <Form.Field {form} name="event" class="w-full">
    <Form.Control let:attrs>
      <Form.Label>{$LL.common.event()}</Form.Label>
      <Select.Root
        selected={selectedEvent}
        onSelectedChange={(v) => {
          v && ($formData.event = v.value)
        }}
      >
        <Select.Trigger {...attrs}>
          <Select.Value placeholder={$LL.common.select()} />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="record.created" label={$LL.table.events.record.created()} />
          <Select.Item value="record.updated" label={$LL.table.events.record.updated()} />
          <Select.Item value="record.deleted" label={$LL.table.events.record.deleted()} />
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData.event} name={attrs.name} />
    </Form.Control>
  </Form.Field>

  <Collapsible.Root class="space-y-2" open={enableCondition}>
    <div class="flex items-center gap-2">
      <Label for="enableCondition">{$LL.common.enableCondition()}</Label>
      <Switch id="enableCondition" bind:checked={enableCondition} />
    </div>
    <Collapsible.Content>
      <FiltersEditor class="rounded-sm border" bind:value={$condition} table={$table} />
    </Collapsible.Content>
  </Collapsible.Root>

  <Form.Button {disabled}>{$LL.common.submit()}</Form.Button>
</form>

<!-- <div class="mt-2">
  <SuperDebug data={$formData} />
</div> -->
