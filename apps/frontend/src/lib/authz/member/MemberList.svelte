<script lang="ts">
	import type { IQueryMember } from '@undb/authz'
	import MemberListItem from './MemberListItem.svelte'
	import InviteButton from '$lib/invitation/InviteButton.svelte'
	import { hasPermission } from '$lib/store/authz'
	import { queryParam } from 'sveltekit-search-params'
	import { isString } from 'lodash-es'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'

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
					<Input name="search" value={$q} placeholder={$t('search', { ns: 'common' })} />
					<Button variant="secondary" type="submit" size="icon" class="hidden lg:block">
						<i class="ti ti-search"></i>
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
