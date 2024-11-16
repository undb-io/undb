<script lang="ts">
  import * as Select from "$lib/components/ui/select"
  import { Input } from "$lib/components/ui/input"

  // 生成时间选项
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }))

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }))

  export let value = { hour: 0, minute: 0 }
  export let onValueChange: (value: { hour: number; minute: number }) => void = () => {}
  export let disabled = false


  let hourSearch = ""
  let minuteSearch = ""

  $: selectedHour = {
    label: value.hour.toString().padStart(2, "0"),
    value: value.hour.toString(),
  }

  $: selectedMinute = {
    label: value.minute.toString().padStart(2, "0"),
    value: value.minute.toString(),
  }

  $: filteredHours = hours.filter((h) => h.value.includes(hourSearch) || parseInt(hourSearch) === parseInt(h.value))

  $: filteredMinutes = minutes.filter(
    (m) => m.value.includes(minuteSearch) || parseInt(minuteSearch) === parseInt(m.value),
  )

  function validateHour(input: string) {
    const num = parseInt(input)
    if (isNaN(num) || num < 0 || num > 23) return false
    return true
  }

  function validateMinute(input: string) {
    const num = parseInt(input)
    if (isNaN(num) || num < 0 || num > 59) return false
    return true
  }

  function updateValue() {
    onValueChange(value)
  }
</script>

<div class="flex items-center gap-2">
  <Select.Root
    selected={selectedHour}
    onSelectedChange={(v) => {
      if (v?.value && validateHour(v.value)) {
        value.hour = parseInt(v.value)
        updateValue()
      }
    }}
    {disabled}
  >
    <Select.Trigger class="flex-1">
      <Select.Value placeholder="Hour" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group class="max-h-[200px] overflow-y-auto">
        {#each filteredHours as hour}
          <Select.Item
            value={hour.value}
            class="data-[highlighted]:bg-accent data-[selected=true]:bg-accent"
            data-selected={parseInt(hour.value) === parseInt(selectedHour.value)}
          >
            {hour.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>

  <span class="text-gray-500">:</span>

  <Select.Root
    selected={selectedMinute}
    onSelectedChange={(v) => {
      if (v?.value && validateMinute(v.value)) {
        value.minute = parseInt(v.value)
        updateValue()
      }
    }}
    {disabled}
  >
    <Select.Trigger class="flex-1">
      <Select.Value placeholder="Min" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group class="max-h-[200px] overflow-y-auto">
        {#each filteredMinutes as minute}
          <Select.Item
            value={minute.value}
            class="data-[highlighted]:bg-accent data-[selected=true]:bg-accent"
            data-selected={parseInt(minute.value) === parseInt(selectedMinute.value)}
          >
            {minute.label}
          </Select.Item>
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
</div>
