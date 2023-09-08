<script lang="ts">
	import type { StringField } from '@undb/core'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined
	export let field: StringField
</script>

<Input bind:value class={$$restProps.class} autocomplete="off" />
