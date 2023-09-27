<script lang="ts">
	import CollaboratorComponent from '../CellComponents/CollaboratorComponent.svelte'
	import { trpc } from '$lib/trpc/client'
	import { t } from '$lib/i18n'
	import type { ICollaboratorProfile } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import Label from '$components/ui/label/label.svelte'
	import { cn } from '$lib/utils'

	export let value: string[] | undefined
	export let readonly = false

	let open = false
	let opened = false

	$: if (!value) {
		value = []
	}

	$: if (open) {
		opened = true
	}

	$: query = trpc().user.users.query({}, { enabled: opened })
	$: members = $query.data?.users ?? []

	$: selectedQuery = trpc().user.users.query({ ids: value }, { enabled: !!value?.length && !opened })
	$: selectedMembers = $selectedQuery?.data?.users ?? []

	$: allMembers = [...members, ...selectedMembers]

	let selected: ICollaboratorProfile[] = []
	$: if (Array.isArray(value) && value?.length)
		selected = value?.map((userId) => allMembers.find((m) => m.userId === userId)!).filter(Boolean) ?? []
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			type="button"
			class={cn('inline-flex gap-3 max-h-10', $$restProps.class)}
			disabled={readonly}
		>
			{#if selected.length}
				{#each selected as member}
					<CollaboratorComponent username={member.username} avatar={member.avatar} color={member.color} size="sm" />
				{/each}
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
		{#each members as member}
			{@const selected = value?.includes(member.userId)}
			<DropdownMenu.Item on:click={(e) => e.preventDefault()}>
				<Label class="inline-flex items-center justify-between cursor-pointer w-full ">
					<input type="checkbox" bind:group={value} value={member.userId} class="hidden" />
					<CollaboratorComponent username={member.username} avatar={member.avatar} color={member.color} />
					{#if selected}
						<i class="ti ti-check"></i>
					{/if}
				</Label>
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
