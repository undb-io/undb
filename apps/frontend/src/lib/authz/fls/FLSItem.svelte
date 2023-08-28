<script lang="ts">
	import type { FLS } from '@undb/authz'
	import type { IFilter } from '@undb/core'
	import FlsItemEditor from './FLSItemEditor.svelte'
	import type { ISubjectType } from './fls.type'

	export let fls: FLS

	let userIds: string[] = fls.subjects.subjects.map((s) => s.value.id)
	let filter: IFilter[] = fls.policy.filter as IFilter[]
	let subject: ISubjectType
</script>

<li class="flex items-start gap-2">
	<div class="flex-1 w-full p-1 rounded-md bg-gray-100 border border-gray-200">
		<FlsItemEditor action={fls.policy.action} bind:filter bind:userIds bind:subject />
	</div>

	<!-- {#if $hasPermission('fls:update')}
		<Button class="w-20 whitespace-nowrap" color="alternative" size="xs">
			{$t('Update RLS', { ns: 'authz' })}
		</Button>
	{/if}
	{#if $hasPermission('fls:delete')}
		<Button
			color="alternative"
			size="xs"
			on:click={() =>
				$deleteRLS.mutate({
					id: rls.id.value,
				})}
		>
			<i class="ti ti-trash"></i>
		</Button>
	{/if} -->
</li>
