<script lang="ts">
	import type { EmailField } from '@undb/core'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined
	export let field: EmailField

	export let readonly = false
</script>

<Input
	bind:value
	placeholder="https://example.com"
	class={$$restProps.class}
	autocomplete="off"
	type="url"
	readonly={readonly ? true : undefined}
/>
