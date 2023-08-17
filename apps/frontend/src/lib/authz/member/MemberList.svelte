<script lang="ts">
	import type { IQueryMember } from '@undb/authz'
	import MemberListItem from './MemberListItem.svelte'
	import InviteButton from '$lib/invitation/InviteButton.svelte'
	import { hasPermission } from '$lib/store/authz'
	import { queryParam } from 'sveltekit-search-params'
	import { Button, Search } from 'flowbite-svelte'
	import { isString } from 'lodash-es'

	export let members: IQueryMember[]

	let q = queryParam('q')

	let form: HTMLFormElement

	const onSubmit = (event: Event) => {
		const formData = new FormData(form)
		const query = formData.get('search')
		if (isString(query) && !!query) {
			q.set(query)
		}
	}
</script>

<div class="space-y-4">
	<div class="w-full flex justify-between">
		<div></div>
		<div class="flex items-center gap-2">
			<form on:submit={onSubmit} bind:this={form}>
				<div class="flex items-center gap-2">
					<Search name="search" value={$q} size="sm" />
					<Button type="submit" size="xs" class="!p-2.5 hidden lg:block">
						<svg
							class="w-3 h-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</Button>
				</div>
			</form>
			{#if $hasPermission('invitation:invite')}
				<InviteButton />
			{/if}
		</div>
	</div>

	<ul class="gap-4 flex flex-col w-full">
		{#each members as member (member.id)}
			<MemberListItem {member} />
		{/each}
	</ul>
</div>
