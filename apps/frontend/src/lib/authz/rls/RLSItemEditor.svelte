<script lang="ts">
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import type { IRLSAction, IRLSSubject } from '@undb/authz/dist'
	import type { IFilter } from '@undb/core'
	import { Button } from 'flowbite-svelte'
	import RlsSubject from './RLSSubject.svelte'
	import { t } from '$lib/i18n'
	import type { ISubjectType } from './rls.type'

	export let action: IRLSAction = 'list'
	export let filter: IFilter[]
	let subject: ISubjectType = 'anyone'

	export let userIds: string[] = []
</script>

<div class="space-y-2">
	<RlsSubject {action} bind:subject bind:value={userIds} />
	<FilterEditor bind:value={filter} let:add>
		<Button on:click={add} class="w-full mt-2" size="xs" color="alternative">
			{$t('Create New Filter')}
		</Button>
	</FilterEditor>
</div>
