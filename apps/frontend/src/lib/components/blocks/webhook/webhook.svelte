<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query"
  import * as Card from "$lib/components/ui/card"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import type { IWebhookDTO } from "@undb/webhook"
  import EmptyWebhook from "./empty-webhook.svelte"
  import CreateWebhookDialog from "./create-webhook-dialog.svelte"

  const table = getTable()

  const getWebhooks = createQuery({
    queryKey: ["tables", $table.id.value, "webhooks"],
    queryFn: () => trpc.webhook.list.query({ tableId: $table.id.value }),
  })

  $: webhooks = (($getWebhooks.data as any)?.webhooks ?? []) as IWebhookDTO[]
</script>

{#if webhooks.length}
  {#each webhooks as webhook}
    <Card.Root>
      <Card.Content>
        <p>{webhook.name}</p>
      </Card.Content>
    </Card.Root>
  {/each}
{:else}
  <EmptyWebhook />
{/if}

<CreateWebhookDialog />
