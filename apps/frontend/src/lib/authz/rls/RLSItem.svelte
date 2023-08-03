<script lang="ts">
	import type { IQueryRLS } from '@undb/authz'
	import { actions } from './actions'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { Select, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'

	export let rls: IQueryRLS
</script>

<li class="flex items-start gap-2">
	<Select class="w-30" items={actions} bind:value={rls.policy.action} />
	<div class="flex-1 w-full p-1 rounded-md bg-gray-100 border border-gray-200">
		<FilterEditor bind:value={rls.policy.filter} let:add>
			<Button on:click={add} class="w-full mt-2" size="xs" color="alternative">{$t('Create New Filter')}</Button>
		</FilterEditor>
	</div>

	<Button class="w-20 whitespace-nowrap" color="alternative" size="xs" on:click={() => {}}>
		{$t('Update RLS')}
	</Button>
</li>
