<script lang="ts">
	import { t } from '$lib/i18n'
	import FieldPicker from './FieldPicker.svelte'
	import { allTableFields } from '$lib/store/table'
	import { Label } from '$components/ui/label'

	export let value: string
	export let required = false

	$: fields = $allTableFields
</script>

<Label class="space-y-2">
	<div class="space-x-1">
		<span>{$t('Reference Field')}</span>
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</div>
	<FieldPicker
		{...$$restProps}
		{fields}
		bind:value
		filter={(f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent'}
	/>
</Label>
