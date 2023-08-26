<script lang="ts">
	import * as Select from '$lib/components/ui/select'

	export let value: string[] = []
	$: {
		if (!value) value = []
	}

	const types = [
		{ value: '.pdf', label: '.pdf' },
		{ value: '.png', label: '.png' },
		{ value: '.docx', label: '.docx' },
		{ value: '.xlsx', label: '.xlsx' },
		{ value: '.pptx', label: '.pptx' },
		{ value: '.txt', label: '.txt' },
	] as const
</script>

<Select.Root bind:selected={value}>
	<Select.Trigger>
		<Select.Value class="font-bold text-xs" />
	</Select.Trigger>
	<Select.Content>
		{#each types as type}
			<Select.Item value={type.value}>{type.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
