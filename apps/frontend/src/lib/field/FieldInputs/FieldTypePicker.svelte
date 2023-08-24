<script lang="ts">
	import FieldIcon from '../FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from '../types'
	import type { IFieldType } from '@undb/core'
	import { t } from '$lib/i18n'
	import * as Select from '$lib/components/ui/select'

	export let value: IFieldType | undefined
	export let types = FIELD_SELECT_ITEMS
	export let filter: (type: IFieldType) => boolean = () => true
</script>

<Select.Root bind:value>
	<Select.Trigger>
		<Select.Value />
	</Select.Trigger>
	<Select.Content>
		{#each types.filter((type) => filter(type.value)) as type}
			<Select.Item value={type.value} class="gap-2">
				<FieldIcon type={type.value} size={16} />
				<span>
					{$t(type.value)}
				</span>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
