<script setup lang="ts">
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
</script>

<template>
  <UHeader :toggle="false">
    <template #right>
      <CategoryAddModal v-if="user" />

      <UColorModeButton variant="link" />

      <UAvatar
        v-if="user"
        :src="avatarSrc"
      />

      <UButton
        v-if="user"
        variant="link"
        color="primary"
        @click="logout"
      >
        Logout
      </UButton>
    </template>
  </UHeader>
</template>
