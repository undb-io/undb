<script lang="ts">
	import type { IQueryUser } from '@undb/core'
	import { Button, Checkbox, Dropdown, DropdownItem } from 'flowbite-svelte'
	import Collaborator from '../Collaborator.svelte'

	export let value: string[] | undefined

	let members: IQueryUser[] = []

	let group: string[]

	let open = false
	let opened = false

	$: if (open) {
		opened = true
	}

	async function fetchMembers() {
		members = await fetch('/members')
			.then((r) => r.json())
			.then((m) => m.users)
	}
	$: if (opened) {
		fetchMembers()
	}

	$: value = group

	$: membersMap = new Map(members.map((m) => [m.userId, m]))
	$: selected = group?.map((userId) => membersMap.get(userId)!).filter(Boolean) ?? []
</script>

<Button color="alternative" class="inline-flex gap-3 max-h-10 max-w-max">
	{#if selected.length}
		{#each selected as member}
			<Collaborator username={member.username} avatar={member.avatar} />
		{/each}
	{:else}
		Select Collaborator
	{/if}
</Button>
<Dropdown bind:open>
	{#each members as member}
		<Checkbox bind:group value={member.userId} custom>
			<div class="px-4 py-2 cursor-pointer w-full hover:bg-gray-100">
				<Collaborator username={member.username} avatar={member.avatar} />
			</div>
		</Checkbox>
	{/each}
</Dropdown>
