<script lang="ts">
  import { hasPermission } from "$lib/store/space-member.store"
  import { Users } from "lucide-svelte"
  import InvitationsListButton from "../invitations/invitations-list-button.svelte"
  import InviteButton from "../invite/invite-button.svelte"
  import MembersTable from "./members-table.svelte"
  import { queryParam } from "sveltekit-search-params"
  import type { GetMembers$result, GetMemberStore } from "$houdini"
  import type { ISpaceDTO } from "@undb/space"
  import { Input } from "$lib/components/ui/input"
  import { LL } from "@undb/i18n/client"

  const mq = queryParam("mq")

  export let members: GetMembers$result["members"]
  export let fetchMembers: () => Promise<void>

  export let space: ISpaceDTO
</script>

<div class="flex justify-between">
  <h4 class="flex items-center">
    <Users class="mr-2 h-4 w-4" />
    {$LL.setting.members()}
  </h4>
  <div class="flex items-center gap-2">
    {#if $hasPermission("authz:invite")}
      {#if space.isPersonal}
        <p class="text-muted-foreground text-xs font-normal">{$LL.space.cannotInviteMemberToPersonalSpace()}</p>
      {/if}
      <InviteButton disabled={space.isPersonal} />
    {/if}
    {#if !space.isPersonal}
      {#if $hasPermission("authz:listInvitation")}
        <InvitationsListButton />
      {/if}
    {/if}
  </div>
</div>

<Input bind:value={$mq} on:change={() => fetchMembers()} placeholder={$LL.space.searchMembers()} class="max-w-xs" />
<MembersTable {members} />
