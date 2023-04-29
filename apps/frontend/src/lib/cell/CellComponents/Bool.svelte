<script lang="ts">
	import type { BoolFieldValue } from '@undb/core'
	import { Checkbox } from 'flowbite-svelte'

	export let value: BoolFieldValue
</script>

<Checkbox readonly checked={value.unpack()} />
