<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { Breadcrumb, BreadcrumbItem, Button, P } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()
</script>

<Breadcrumb aria-label="undb navigator">
	<BreadcrumbItem class="whitespace-nowrap flex items-center" href="/" home
		>{$t('Home', { ns: 'common' })}</BreadcrumbItem
	>
	<BreadcrumbItem class="whitespace-nowrap flex items-center">{$table.name.value}</BreadcrumbItem>
	<BreadcrumbItem class="whitespace-nowrap flex items-center">
		<span class="inline-flex items-center gap-2">
			<ViewIcon type={$view.displayType} class="!text-gray-500" />
			<span>
				{$view.name.value}
			</span>
		</span>
	</BreadcrumbItem>
</Breadcrumb>
