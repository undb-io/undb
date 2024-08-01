<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { developerTab } from "$lib/store/tab.store"
  import { Code2Icon, WaypointsIcon, WebhookIcon } from "lucide-svelte"
  import Openapi from "../openapi/openapi.svelte"
  import Webhook from "../webhook/webhook.svelte"
  import Relations from "../relations/relations.svelte"
</script>

<Tabs.Root
  value={$developerTab}
  onValueChange={(tab) => {
    $developerTab = tab ?? null
  }}
  class="flex h-full w-full flex-col"
>
  <div class="bg-background relative flex h-10 w-full items-end justify-center border-b">
    <Tabs.List class="bg-background absolute bottom-0 left-1/2 -translate-x-1/2 transform pb-0">
      <Tabs.Trigger
        value="openapi"
        class="data-[state=active]:border-primary pb-2 shadow-none data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
      >
        <Code2Icon class="text-muted-foreground mr-2 h-4 w-4" />
        OpenAPI
      </Tabs.Trigger>
      <Tabs.Trigger
        value="webhook"
        class="data-[state=active]:border-primary pb-2 shadow-none data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
      >
        <WebhookIcon class="text-muted-foreground mr-2 h-4 w-4" />
        Webhook
      </Tabs.Trigger>
      <Tabs.Trigger
        value="relations"
        class="data-[state=active]:border-primary pb-2 shadow-none data-[state=active]:rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
      >
        <WaypointsIcon class="text-muted-foreground mr-2 h-4 w-4" />
        Relations
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
  <Tabs.Content value="relations" class="flex-1">
    {#if $developerTab === "relations"}
      <Relations />
    {/if}
  </Tabs.Content>
</Tabs.Root>
