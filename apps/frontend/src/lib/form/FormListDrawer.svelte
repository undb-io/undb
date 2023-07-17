<script lang="ts">
	import { Button, Drawer, Heading } from 'flowbite-svelte'
	import FormsList from './FormsList.svelte'
	import { sineIn } from 'svelte/easing'
	import { formDrawerMode, formListDrawer } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import CreateForm from './CreateForm.svelte'
	import { page } from '$app/stores'

	const table = getTable()

	let transitionParams = {
		x: 320,
		duration: 100,
		easing: sineIn,
	}
</script>

<Drawer
	title="Forms"
	class="h-full !w-1/3 flex flex-col"
	transitionType="fly"
	{transitionParams}
	placement="right"
	bind:hidden={$formListDrawer.hidden}
>
	{#if $formDrawerMode === 'list'}
		<div class="flex items-center justify-between">
			<Heading tag="h5" class="whitespace-nowrap truncate">
				{$table.name.value} - {$t('forms')}
			</Heading>

			<Button size="xs" class="whitespace-nowrap" on:click={() => ($formDrawerMode = 'create')}>
				{$t('Create New Form')}
			</Button>
		</div>
		<FormsList />
	{:else if $formDrawerMode === 'create'}
		<CreateForm data={$page.data.createForm} />
	{/if}
</Drawer>
