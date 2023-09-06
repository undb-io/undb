<script lang="ts">
	import type { EmailField } from '@undb/core'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined
	export let field: EmailField
</script>

<Input bind:value placeholder="https://example.com" {...$$restProps} autocomplete="off" type="url" />
