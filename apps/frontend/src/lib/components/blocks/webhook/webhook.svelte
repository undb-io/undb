<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query"
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import type { IWebhookDTO } from "@undb/webhook"
  import EmptyWebhook from "./empty-webhook.svelte"
  import WebhookCard from "./webhook-card.svelte"
  import CreateWebhookDialog from "./create-webhook-dialog.svelte"

  const table = getTable()

  const getWebhooks = createQuery({
    queryKey: ["tables", $table.id.value, "webhooks"],
    queryFn: () => trpc.webhook.list.query({ tableId: $table.id.value }),
  })

  $: webhooks = (($getWebhooks.data as any)?.webhooks ?? []) as IWebhookDTO[]
</script>

{#if webhooks.length}
  <div class="mx-auto max-w-4xl">
    {#each webhooks as webhook}
      <WebhookCard {webhook} />
    {/each}
  </div>
{:else if !$getWebhooks.isLoading}
  <EmptyWebhook />
{/if}

<CreateWebhookDialog />
