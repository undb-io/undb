<script lang="ts">
  import { browser } from "$app/environment"
  import { GetMemberStore } from "$houdini"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import * as Avatar from "$lib/components/ui/avatar"

  export let userId: string

  $: store = new GetMemberStore()

  $: browser && store.fetch({ variables: { id: userId }, policy: "NetworkOnly" })
  $: member = $store.data?.memberById
</script>

<HoverCard.Content class="p-0">
  <div class="flex justify-center gap-2 p-2">
    <Avatar.Root>
      <Avatar.Image src="" alt={member?.user.username} />
      <Avatar.Fallback>{member?.user.username.slice(0, 2)}</Avatar.Fallback>
    </Avatar.Root>

    <div class="flex-1">
      <div class="font-semibold">{member?.user.username}</div>
      <div class="text-muted-foreground text-sm">{member?.user.email}</div>
    </div>
  </div>
  <div class="border-t bg-gray-50 px-2 py-1.5">
    <div class="text-muted-foreground text-xs">Has {member?.role} access</div>
  </div>
</HoverCard.Content>
