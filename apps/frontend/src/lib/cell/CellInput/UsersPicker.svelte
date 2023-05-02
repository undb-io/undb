<script lang="ts">
	import { Button, Checkbox, Dropdown } from 'flowbite-svelte'
	import CollaboratorComponent from '../CellComponents/CollaboratorComponent.svelte'
	import { trpc } from '$lib/trpc/client'
	import { t } from '$lib/i18n'

	export let value: string[] | undefined

	let group: string[]

	let open = false
	let opened = false

	$: if (open) {
		opened = true
	}

	$: query = trpc().user.users.query({}, { enabled: opened })
	$: members = $query.data?.users ?? []

	$: value = group

	$: membersMap = new Map(members.map((m) => [m.userId, m]))
	$: selected = group?.map((userId) => membersMap.get(userId)!).filter(Boolean) ?? []
</script>

<Button color="alternative" class="inline-flex gap-3 max-h-10 max-w-max">
	{#if selected.length}
		{#each selected as member}
			<CollaboratorComponent username={member.username} avatar={member.avatar} />
		{/each}
	{:else}
		{$t('Select Collaborator')}
	{/if}
</Button>
<Dropdown bind:open>
	{#each members as member}
		{@const isSelected = selected.some((s) => s.userId === member.userId)}
		<Checkbox bind:group value={member.userId} custom>
			<span class="inline-flex items-center justify-between px-4 py-2 cursor-pointer w-full hover:bg-gray-100">
				<CollaboratorComponent username={member.username} avatar={member.avatar} />
				{#if isSelected}
					<i class="ti ti-check" />
				{/if}
			</span>
		</Checkbox>
	{/each}
</Dropdown>
