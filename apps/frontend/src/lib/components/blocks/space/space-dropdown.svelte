<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import type { ISpaceDTO } from "@undb/space"
  import { builderActions, getAttrs } from "bits-ui"
  import Logo from "$lib/images/logo.svg"

  export let space: ISpaceDTO
  export let me: any
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <button class={$$restProps.class} use:builderActions={{ builders: [builder] }} {...getAttrs([builder])}>
      <img src={Logo} alt="" class="h-4 w-4 rounded-full" />
      {#if space.isPersonal}
        {me.username}'s Personal Space
      {:else}
        {space.name}
      {/if}
    </button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content sameWidth>
    <DropdownMenu.Group>
      <DropdownMenu.Label>My Account</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Profile</DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Team</DropdownMenu.Item>
      <DropdownMenu.Item>Subscription</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
