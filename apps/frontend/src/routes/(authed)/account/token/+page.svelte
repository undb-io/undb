<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { createQuery } from "@tanstack/svelte-query"
  import type { PageData } from "./$types"
  import CreateApiTokenButton from "$lib/components/blocks/api-toksn/create-api-token-button.svelte"
  import type { IApiTokenDTO } from "@undb/openapi"
  import * as Table from "$lib/components/ui/table"
  import { CopyIcon, TrashIcon, EyeIcon, EyeOffIcon } from "lucide-svelte"
  import { copyToClipboard } from "@svelte-put/copy"
  import { toast } from "svelte-sonner"

  export let data: PageData

  const getApiTokens = createQuery({
    queryFn: () => trpc.apiToken.list.query({ userId: data.me.user.userId }),
    queryKey: ["apiTokens"],
  })

  $: apiTokens = ($getApiTokens.data ?? []) as IApiTokenDTO[]

  let show = false

  const copy = async (token: string) => {
    await copyToClipboard(token)
    toast.success("Copied token to clipboard")
  }
</script>

<main class="container py-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Api Token</h1>

    <CreateApiTokenButton disabled={!!apiTokens.length} userId={data.me.user.userId} />
  </div>

  {#if !apiTokens.length}
    <section class="flex h-full flex-col overflow-hidden">
      <div
        class="flex flex-1 -translate-y-6 items-center justify-center rounded-lg"
        data-x-chunk-name="dashboard-02-chunk-1"
        data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
      >
        <div class="flex flex-col items-center gap-3 text-center">
          <h3 class="text-2xl font-bold tracking-tight">You have no api tokens</h3>
          <p class="text-muted-foreground text-sm">Click button to create your first api token</p>
          <CreateApiTokenButton userId={data.me.user.userId} />
        </div>
      </div>
    </section>
  {:else}
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[300px] truncate font-semibold">Name</Table.Head>
          <Table.Head>Creator</Table.Head>
          <Table.Head>Token</Table.Head>
          <Table.Head class="text-right">Action</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each apiTokens as apiToken}
          <Table.Row>
            <Table.Cell class="font-medium">{apiToken.name}</Table.Cell>
            <Table.Cell>{data.me.user.email}</Table.Cell>
            <Table.Cell>
              {#if show}
                {apiToken.token}
              {:else}
                {"•".repeat(apiToken.token.length)}
              {/if}
            </Table.Cell>
            <Table.Cell class="flex items-center justify-end gap-2">
              <button on:click={() => (show = !show)}>
                {#if show}
                  <EyeOffIcon class="h-4 w-4 text-gray-500" />
                {:else}
                  <EyeIcon class="h-4 w-4 text-gray-500" />
                {/if}
              </button>
              <button on:click={() => copy(apiToken.token)}>
                <CopyIcon class="h-4 w-4 text-gray-500" />
              </button>
              <button>
                <TrashIcon class="h-4 w-4 text-gray-500" />
              </button>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  {/if}
</main>
