<script lang="ts">
  import * as Card from "$lib/components/ui/card"
  import type { IWebhookDTO } from "@undb/webhook"
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { DotsHorizontal } from "svelte-radix"
  import { createMutation } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { tick } from "svelte"

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
          <Switch id="enabled" bind:checked={webhook.enabled} on:click={updateWebhook} />
          <Label for="enabled">Enabled</Label>
        </div>

        <button>
          <DotsHorizontal class="text-muted-foreground h-4 w-4" />
        </button>
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
