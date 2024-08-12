<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import type { IWebhookDTO } from "@undb/webhook"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { DotsHorizontal } from "svelte-radix"
  import { createMutation, QueryObserver, useQueryClient } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { PencilIcon, TrashIcon } from "lucide-svelte"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import { Button } from "$lib/components/ui/button"
  import { hasPermission } from "$lib/store/space-member.store"
  import { toast } from "svelte-sonner"

  const table = getTable()
  export let webhook: IWebhookDTO

  const updateWebhookMutation = createMutation({
    mutationKey: ["table", $table.id.value, "updateWebhook"],
    mutationFn: trpc.webhook.update.mutate,
  })

  const updateWebhook = async () => {
    await tick()
    $updateWebhookMutation.mutate({
      id: webhook.id,
      enabled: webhook.enabled,
    })
  }

  const client = useQueryClient()
  const observer = new QueryObserver(client, {
    queryKey: ["tables", $table.id.value, "webhooks"],
  })

  const deleteWebhookMutation = createMutation({
    mutationKey: ["table", $table.id.value, "deleteWebhook"],
    mutationFn: trpc.webhook.delete.mutate,
    onError(error, variables, context) {
      toast.error(error.message)
    },
    onSuccess(data, variables, context) {
      $observer.refetch()
    },
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
          <Switch size="sm" id={"enabled" + webhook.id} bind:checked={webhook.enabled} on:click={updateWebhook} />
          <Label class="text-xs" for={"enabled" + webhook.id}>Enabled</Label>
        </div>

        <DropdownMenu.Root closeOnItemClick={false}>
          <DropdownMenu.Trigger>
            <DotsHorizontal class="text-muted-foreground h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Label>Webhook Action</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item class="text-xs">
                <PencilIcon class="mr-1.5 h-3 w-3" />
                Update Webhook
              </DropdownMenu.Item>
              <DropdownMenu.Item class="text-xs">Duplicate Webhook</DropdownMenu.Item>
              <AlertDialog.Root>
                <DropdownMenu.Item class="text-xs text-red-500 hover:!bg-red-100 hover:!text-red-500">
                  <AlertDialog.Trigger class="flex items-center">
                    <TrashIcon class="mr-1.5 h-3 w-3" />
                    Delete Webhook
                  </AlertDialog.Trigger>
                </DropdownMenu.Item>
                <AlertDialog.Content>
                  <AlertDialog.Header>
                    <AlertDialog.Title>Delete Webhook</AlertDialog.Title>
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
                        $deleteWebhookMutation.isPending || !$hasPermission("space:delete")}
                        on:click={async () => {
                          await $deleteWebhookMutation.mutateAsync({ id: webhook.id })
                        }}
                      >
                        Delete Space
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
