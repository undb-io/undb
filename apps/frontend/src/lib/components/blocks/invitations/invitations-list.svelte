<script lang="ts">
  import { GetInvitationsStore } from "$houdini"
  import { onMount } from "svelte"
  import * as Table from "$lib/components/ui/table"

  const store = new GetInvitationsStore()

  onMount(() => {
    store.fetch({})
  })

  $: invitations = $store.data?.invitations ?? []
</script>

<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
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
        <Table.Cell>{invitation.status}</Table.Cell>
        <Table.Cell>{invitation.role}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
