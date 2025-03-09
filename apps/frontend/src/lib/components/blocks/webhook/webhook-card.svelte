<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import type { IWebhookConditionOptionSchema, IWebhookDTO } from '@undb/webhook'
  import { Label } from '$lib/components/ui/label/index.js'
  import { Switch } from '$lib/components/ui/switch/index.js'
  import { DotsHorizontal } from 'svelte-radix'
  import { createMutation, QueryObserver, useQueryClient } from '@tanstack/svelte-query'
  import { getTable } from '$lib/store/table.store'
  import { trpc } from '$lib/trpc/client'
  import { onMount, tick } from 'svelte'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import { CopyIcon, PencilIcon, TrashIcon } from 'lucide-svelte'
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
  import { Button } from '$lib/components/ui/button'
  import { hasPermission } from '$lib/store/space-member.store'
  import { toast } from 'svelte-sonner'
  import * as Dialog from '$lib/components/ui/dialog'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zodClient } from 'sveltekit-superforms/adapters'
  import { updateWebhookCommand } from '@undb/commands'
  import * as Form from '$lib/components/ui/form'
  import { Input } from '$lib/components/ui/input'
  import * as Select from '$lib/components/ui/select/index.js'
  import * as Collapsible from '$lib/components/ui/collapsible'
  import FiltersEditor from '../filters-editor/filters-editor.svelte'
  import { writable } from 'svelte/store'
  import { type MaybeConditionGroup, parseValidViewFilter, toMaybeConditionGroup } from '@undb/table'
  import { LL } from '@undb/i18n/client'

  const table = getTable()
  export let webhook: IWebhookDTO

  $: console.log(webhook)
  $: console.log(webhook.condition)

  let updateOpen = false

  const updateWebhookMutation = createMutation({
    mutationKey: ['table', $table.id.value, 'updateWebhook'],
    mutationFn: trpc.webhook.update.mutate,
  })

  const updateWebhook = async () => {
    await tick()
    $updateWebhookMutation.mutate({
      id: webhook.id,
      enabled: webhook.enabled,
    })
  }

  const form = superForm(
    defaults(
      {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        enabled: webhook.enabled,
        method: webhook.method,
        event: webhook.event,
        headers: webhook.headers,
        condition: webhook.condition,
      },
      zodClient(updateWebhookCommand),
    ),
    {
      SPA: true,
      dataType: 'json',
      validators: zodClient(updateWebhookCommand),
      resetForm: false,
      invalidateAll: false,
      async onUpdate(event) {
        if (!event.form.valid) {
          console.log(event.form.errors)
          return
        }

        await $updateWebhookMutation.mutateAsync(event.form.data)

        updateOpen = false
        $observer.refetch()
      },
    },
  )

  const { form: formData, enhance, tainted } = form

  const client = useQueryClient()
  const observer = new QueryObserver(client, {
    queryKey: ['tables', $table.id.value, 'webhooks'],
  })

  const deleteWebhookMutation = createMutation({
    mutationKey: ['table', $table.id.value, 'deleteWebhook'],
    mutationFn: trpc.webhook.delete.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    onSuccess(data, variables, context) {
      $observer.refetch()
    },
  })

  const condition = writable<MaybeConditionGroup<IWebhookConditionOptionSchema> | undefined>(
    toMaybeConditionGroup(webhook?.condition),
  )
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
  onMount(() => {
    enableCondition = webhook?.condition !== undefined
  })
</script>

<Card.Root>
  <Card.Content class="grid gap-3 py-4">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span>
          {webhook.name}
        </span>
        <span
          class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
        >
          {webhook.method}
        </span>
        <span
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-blue-700/10"
        >
          {webhook.event}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center space-x-2">
          <Switch size="sm" id={'enabled' + webhook.id} bind:checked={webhook.enabled} on:click={updateWebhook} />
          <Label class="text-xs" for={'enabled' + webhook.id}>{$LL.common.enabled()}</Label>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <DotsHorizontal class="text-muted-foreground h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Label>Webhook Action</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item class="text-xs" on:click={() => (updateOpen = true)}>
                <PencilIcon class="mr-1.5 h-3 w-3" />
                {$LL.webhook.update()}
              </DropdownMenu.Item>
              <DropdownMenu.Item class="text-xs">
                <CopyIcon class="mr-1.5 h-3 w-3" />
                {$LL.webhook.duplicate()}
              </DropdownMenu.Item>
              <AlertDialog.Root>
                <DropdownMenu.Item class="text-xs text-red-500 hover:!bg-red-100 hover:!text-red-500">
                  <AlertDialog.Trigger class="flex items-center">
                    <TrashIcon class="mr-1.5 h-3 w-3" />
                    {$LL.webhook.delete()}
                  </AlertDialog.Trigger>
                </DropdownMenu.Item>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <AlertDialog.Title>{$LL.webhook.delete()}</AlertDialog.Title>
                    <AlertDialog.Description>
                      This action cannot be undone. This will permanently delete the webhook.
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action asChild let:builder>
                      <Button
                        variant="destructive"
                        builders={[builder]}
                        disabled={//
                        $deleteWebhookMutation.isPending || !$hasPermission('space:delete')}
                        on:click={async () => {
                          await $deleteWebhookMutation.mutateAsync({ id: webhook.id })
                        }}
                      >
                        {$LL.webhook.delete()}
                      </Button>
                    </AlertDialog.Action>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>

    <div>
      <span
        class="inline-flex items-center truncate rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
      >
        {webhook.url}
      </span>
    </div>
  </Card.Content>
</Card.Root>

<Dialog.Root bind:open={updateOpen}>
  <Dialog.Content class="z-50">
    <Dialog.Header>
      <Dialog.Title>{$LL.webhook.update()}</Dialog.Title>
    </Dialog.Header>

    <form method="POST" class="space-y-2" id="updateWebhook" use:enhance>
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
                <Select.Value placeholder="Select a method" />
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
              <Select.Value placeholder="Select a event" />
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
      <Form.Button disabled={!$tainted} class="w-full">{$LL.common.submit()}</Form.Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
