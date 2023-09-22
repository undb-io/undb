<script lang="ts">
	import { cn } from '$lib/utils'
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import CollaboratorComponent from '../CellComponents/CollaboratorComponent.svelte'
	import { trpc } from '$lib/trpc/client'
	import { t } from '$lib/i18n'
	import type { IQueryUser } from '@undb/core'

	export let value: string | undefined

	let open = false
	let opened = false

	$: if (open) {
		opened = true
	}

	$: query = trpc().user.users.query({}, { enabled: opened })
	$: members = $query.data?.users ?? []

	$: membersMap = new Map(members.map((m) => [m.userId, m]))

	$: selectedQuery = trpc().user.users.query({ id: value }, { enabled: !!value && !opened && !selected })
	$: selectedMembers = $selectedQuery?.data?.users ?? []

	let selected: IQueryUser | undefined
	$: if (value) selected = membersMap.get(value) || selectedMembers.find((u) => u.userId === value)
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			type="button"
			variant="outline"
			class={cn('inline-flex gap-3 max-h-10 max-w-none', $$restProps.class)}
			builders={[builder]}
		>
			{#if selected}
				<CollaboratorComponent username={selected.username} avatar={selected.avatar} color={selected.color} size="sm" />
			{:else}
				<div class="flex items-center gap-2">
					<i class="ti ti-user"></i>
					<span>
						{$t('Select Collaborator')}
					</span>
				</div>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each members as member}
				<DropdownMenu.RadioItem value={member.userId}>
					<span class="inline-flex items-center justify-between cursor-pointer w-full">
						<CollaboratorComponent username={member.username} avatar={member.avatar} color={member.color} />
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
