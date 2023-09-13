<script lang="ts">
	import type { StringField } from '@undb/core'
	import { Input } from '$lib/components/ui/input'
	export let value: string | undefined = undefined
	export let field: StringField

	export let readonly = false
</script>

<Input bind:value class={$$restProps.class} autocomplete="off" readonly={readonly ? true : undefined} />
