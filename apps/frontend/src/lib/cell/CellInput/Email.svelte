<script lang="ts">
	import type { EmailField } from '@undb/core'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined
	export let field: EmailField

	export let readonly = false
</script>

<Input bind:value class={$$restProps.class} autocomplete="off" type="email" readonly={readonly ? true : undefined} />
