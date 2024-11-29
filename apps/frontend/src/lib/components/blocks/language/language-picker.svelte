<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import { loadLocaleAsync, type Locales, setLocale } from "@undb/i18n/client"
  import { EarthIcon } from "lucide-svelte"

  const changeLanguage = async (lang: Locales) => {
    await loadLocaleAsync(lang)
    setLocale(lang)
    localStorage.setItem("lang", lang)
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    <EarthIcon class="size-6 text-gray-600" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Item on:click={() => changeLanguage("en")}>English</DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => changeLanguage("zh")}>中文</DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => changeLanguage("ja")}>日本語</DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => changeLanguage("ko")}>한국어</DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => changeLanguage("es")}>Español</DropdownMenu.Item>
      <DropdownMenu.Item on:click={() => changeLanguage("pt")}>Português</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
