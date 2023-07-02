<script lang="ts">
	import cx from 'classnames'
	import { Button, Radio, Dropdown } from 'flowbite-svelte'
	import CollaboratorComponent from '../CellComponents/CollaboratorComponent.svelte'
	import { trpc } from '$lib/trpc/client'
	import { t } from '$lib/i18n'

	export let value: string | undefined

	let open = false
	let opened = false

	$: if (open) {
		opened = true
	}

	$: query = trpc().user.users.query({}, { enabled: opened })
	$: members = $query.data?.users ?? []

	$: membersMap = new Map(members.map((m) => [m.userId, m]))
	$: selected = value ? membersMap.get(value) : undefined
</script>

<Button color="alternative" class={cx('inline-flex gap-3 max-h-10 max-w-max', $$restProps.class)} {...$$restProps}>
	{#if selected}
		<CollaboratorComponent username={selected.username} avatar={selected.avatar} color={selected.color} />
	{:else}
		{$t('Select Collaborator')}
	{/if}
</Button>
<Dropdown bind:open>
	{#each members as member}
		<Radio bind:group={value} value={member.userId} custom on:change={() => (open = false)}>
			<span
				class="inline-flex items-center justify-between px-4 py-2 cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-400"
			>
				<CollaboratorComponent username={member.username} avatar={member.avatar} color={member.color} />
				{#if selected?.userId === member.userId}
					<i class="ti ti-check dark:text-gray-300" />
				{/if}
			</span>
		</Radio>
	{/each}
</Dropdown>
