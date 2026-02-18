<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const client = useSupabaseClient()
const user = useSupabaseUser()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const { data: profile, refresh } = useFetch('/api/profile', {
  server: false,
  immediate: false,
})

watchEffect(() => {
  if (user.value) {
    refresh()
  }
})

const avatarSrc = computed(() => {
  // SSR → mounted=false → undefined
  // CSR 初回 hydration → mounted=false → undefined
  if (!mounted.value) return undefined

  // hydration 完了後に初めて値を返す
  return profile.value?.avatarUrl
})

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
}

const items = ref<DropdownMenuItem[]>([
  {
    label: 'ログアウト',
    icon: 'i-lucide-log-out',
    onSelect: () => logout(),
  },
])
</script>

<template>
  <UHeader :toggle="false">
    <template #title>
      Todo
    </template>

    <template #right>
      <CategoryAddModal v-if="user" />

      <UColorModeButton :ui="{ base: 'rounded-full', leadingIcon: 'cursor-pointer' }" variant="ghost" />

      <UDropdownMenu
        v-if="user"
        class="cursor-pointer"
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
        :ui="{ content: 'w-auto min-w-0', item: 'cursor-pointer' }"
      >
        <UButton
          class="rounded-full"
          color="neutral"
          variant="ghost"
          :avatar="{ src: avatarSrc, size: 'md' }"
        />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
