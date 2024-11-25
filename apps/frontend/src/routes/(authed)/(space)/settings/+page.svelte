<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs"
  import { SettingsIcon, UsersIcon } from "lucide-svelte"
  import type { LayoutData } from "./$types"
  import { queryParam, ssp } from "sveltekit-search-params"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import SpaceSetting from "$lib/components/blocks/space/space-setting.svelte"
  import MemberSetting from "$lib/components/blocks/member/member-setting.svelte"
  import { LL } from "@undb/i18n/client"

  const mq = queryParam("mq")
  const tab = queryParam("tab", ssp.string())

  export let data: LayoutData
  $: getMembersStore = data.getMembersStore

  $: members = $getMembersStore.data?.members ?? []

  async function fetchMembers() {
    getMembersStore.fetch({ variables: { q: $mq } })
  }

  $: store = data.indexDataStore
  $: space = $store.data?.space
  onMount(async () => {
    if ($store.data?.space?.isPersonal) {
      // await goto("/", { replaceState: true })
    }
  })
</script>

{#if space}
  <main class="space-y-2 p-6">
    <div class="space-y-2">
      <h3 class="flex items-center text-xl">
        <SettingsIcon class="mr-2 h-4 w-4" />
        {$LL.setting.setting()}
      </h3>
    </div>

    <Tabs.Root bind:value={$tab} class="w-full">
      <Tabs.List>
        <Tabs.Trigger value="members">
          <UsersIcon class="mr-2 h-4 w-4" />
          {$LL.setting.members()}
        </Tabs.Trigger>
        <Tabs.Trigger value="settings">
          <SettingsIcon class="mr-2 h-4 w-4" />
          {$LL.setting.setting()}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members" class="space-y-2">
        <MemberSetting {members} {fetchMembers} {space} />
      </Tabs.Content>
      <Tabs.Content value="settings">
        <SpaceSetting {space} />
      </Tabs.Content>
    </Tabs.Root>
  </main>
{/if}
