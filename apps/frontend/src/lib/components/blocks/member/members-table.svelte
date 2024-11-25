<script lang="ts">
  import type { GetMembers$result } from "$houdini"
  import * as Table from "$lib/components/ui/table"
  import Role from "./role.svelte"
  import * as Avatar from "$lib/components/ui/avatar"
  import { LL } from "@undb/i18n/client"

  export let members: GetMembers$result["members"]
</script>

<Table.Root>
  <Table.Caption>{$LL.space.memberList()}</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>{$LL.common.name()}</Table.Head>
      <Table.Head>{$LL.common.email()}</Table.Head>
      <Table.Head>{$LL.common.role()}</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each members as member}
      {#if member}
        <Table.Row>
          <Table.Cell class="flex items-center gap-2 font-medium">
            <Avatar.Root>
              <Avatar.Image src={member.user.avatar} alt={member.user.username} />
              <Avatar.Fallback>{member.user.username.slice(0, 2)}</Avatar.Fallback>
            </Avatar.Root>

            {member.user.username}
          </Table.Cell>
          <Table.Cell>{member.user.email}</Table.Cell>
          <Table.Cell><Role role={member.role} /></Table.Cell>
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>
