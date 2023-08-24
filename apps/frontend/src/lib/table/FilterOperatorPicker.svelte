<script lang="ts">
	import { operaotrsMap, type Field } from '@undb/core'
	import { t } from '$lib/i18n'
	import * as Select from '$lib/components/ui/select'

	let open = false
	export let value: string = ''
	export let field: Field | undefined
	export let readonly = false

	$: data = field?.type ? operaotrsMap[field.type] : []
	$: if (!!field && !data.some((v) => v === value)) {
		value = data[0] ?? ''
	}
</script>

<Select.Root bind:value disabled={readonly}>
	<Select.Trigger>
		<Select.Value class="text-xs font-bold" />
	</Select.Trigger>
	<Select.Content>
		{#each data as item}
			<Select.Item value={item} class="text-xs">
				{$t(item, { ns: 'common' })}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
