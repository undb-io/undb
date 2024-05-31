<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { developerTab } from "$lib/store/tab.store"
  import { Code2Icon, WebhookIcon } from "lucide-svelte"
  import Openapi from "../openapi/openapi.svelte"
  import Webhook from "../webhook/webhook.svelte"
</script>

<Tabs.Root
  value={$developerTab}
  onValueChange={(tab) => {
    $developerTab = tab ?? null
  }}
  class="flex h-full w-full flex-col"
>
  <div class="bg-background relative flex h-12 w-full items-center justify-center border-b">
    <Tabs.List class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <Tabs.Trigger value="openapi">
        <Code2Icon class="text-muted-foreground mr-2 h-4 w-4" />
        OpenAPI
      </Tabs.Trigger>
      <Tabs.Trigger value="webhook">
        <WebhookIcon class="text-muted-foreground mr-2 h-4 w-4" />
        Webhook
      </Tabs.Trigger>
    </Tabs.List>
  </div>
  <Tabs.Content value="openapi" class="flex-1">
    {#if $developerTab === "openapi"}
      <Openapi />
    {/if}
  </Tabs.Content>
  <Tabs.Content value="webhook" class="flex-1">
    {#if $developerTab === "webhook"}
      <Webhook />
    {/if}
  </Tabs.Content>
</Tabs.Root>
