<script lang="ts">
	import { t } from '$lib/i18n'
	import FieldPicker from './FieldPicker.svelte'
	import { allTableFields } from '$lib/store/table'
	import { Label } from '$components/ui/label'

	export let value: string
	export let required = false

	$: fields = $allTableFields
</script>

<div class="space-y-2">
	<Label class="space-x-1">
		<span>{$t('Reference Field')}</span>
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</Label>
	<FieldPicker
		{...$$restProps}
		{fields}
		bind:value
		filter={(f) => f.type === 'reference' || f.type === 'tree' || f.type === 'parent'}
	/>
</div>
