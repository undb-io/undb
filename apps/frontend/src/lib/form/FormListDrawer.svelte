<script lang="ts">
	import FormsList from './FormsList.svelte'
	import { sineIn } from 'svelte/easing'
	import { formDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import CreateForm from './CreateForm.svelte'
	import { page } from '$app/stores'
	import { hasPermission } from '$lib/store/authz'
	import * as Sheet from '$lib/components/ui/sheet'
	import { Button } from '$components/ui/button'

	import { formListDrawer } from '$lib/store/modal'

	const table = getTable()

	let transitionParams = {
		x: 320,
		duration: 100,
		easing: sineIn,
	}
</script>

<Sheet.Root bind:open={$formListDrawer.open}>
	<Sheet.Content class="!w-1/3 !max-w-none">
		<Sheet.Header class="mb-4">
			<Sheet.Title>{$t('Forms')}</Sheet.Title>
		</Sheet.Header>
		{#if $formDrawerMode === 'list'}
			<div class="flex items-center justify-between">
				<h4 class="whitespace-nowrap truncate dark:text-white">
					{$table.name.value} - {$t('forms')}
				</h4>

				{#if $hasPermission('table:create_form')}
					<Button size="sm" class="whitespace-nowrap" on:click={() => ($formDrawerMode = 'create')}>
						{$t('Create New Form')}
					</Button>
				{/if}
			</div>
			<FormsList />
		{:else if $formDrawerMode === 'create' && $hasPermission('table:create_form')}
			<CreateForm data={$page.data.createForm} />
		{/if}
	</Sheet.Content>
</Sheet.Root>
