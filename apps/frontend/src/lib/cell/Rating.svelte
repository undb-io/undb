<script lang="ts">
	import type { RatingField, RatingFieldValue, StringFieldValue } from '@undb/core'
	import { Rating } from 'flowbite-svelte'

	export let value: RatingFieldValue
	export let field: RatingField
</script>

<Rating size={'18'} total={field.max} rating={value.unpack() ?? 0} />
