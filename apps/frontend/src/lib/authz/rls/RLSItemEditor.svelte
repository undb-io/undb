<script lang="ts">
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import type { IRLSAction } from '@undb/authz'
	import type { IFilter } from '@undb/core'
	import RlsSubject from './RLSSubject.svelte'
	import { t } from '$lib/i18n'
	import type { ISubjectType } from './rls.type'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$lib/components/ui/button'
	export let action: IRLSAction = 'list'
	export let filter: Partial<IFilter>[]
	export let subject: ISubjectType = 'anyone'

	export let userIds: string[] = []

	$: readonly = !$hasPermission('rls:update')
</script>

<div class="space-y-2">
	<RlsSubject {action} bind:subject bind:value={userIds} {readonly} />
	<FilterEditor bind:value={filter} let:add {readonly}>
		{#if $hasPermission('rls:update')}
			<Button on:click={add} class="w-full mt-2" size="sm" variant="outline">
				{$t('Create New Filter')}
			</Button>
		{/if}
	</FilterEditor>
</div>
