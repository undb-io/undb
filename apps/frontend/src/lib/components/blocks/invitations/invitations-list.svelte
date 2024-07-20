<script lang="ts">
  import { GetInvitationsStore } from "$houdini"
  import { onMount } from "svelte"
  import { Badge } from "$lib/components/ui/badge"
  import * as Table from "$lib/components/ui/table"
  import Role from "../member/role.svelte"

  const store = new GetInvitationsStore()

  onMount(() => {
    store.fetch({})
  })

  $: invitations = $store.data?.invitations ?? []
</script>

<Table.Root>
  <Table.Caption>A list of pending invatations.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Email</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Role</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invitations as invitation (invitation.id)}
      <Table.Row>
        <Table.Cell class="font-medium">{invitation.email}</Table.Cell>
        <Table.Cell>
          <Badge>
            {invitation.status}
          </Badge>
        </Table.Cell>
        <Table.Cell>
          <Role role={invitation.role} />
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
