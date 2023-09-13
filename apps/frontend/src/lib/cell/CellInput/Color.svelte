<script lang="ts">
	import { cn } from '$lib/utils'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined

	export let readonly = false
</script>

<div {...$$restProps} class={cn('inline-flex items-center gap-2 px-2 text-sm', $$restProps.class)}>
	<Input bind:value autocomplete="off" type="color" readonly={readonly ? true : undefined} />
	<span>{value ?? ''}</span>
</div>
