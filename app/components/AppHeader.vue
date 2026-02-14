<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

const avatarUrl = ref<string | undefined>(undefined)

watchEffect(async () => {
  if (user.value) {
    const profile = await $fetch('/api/profile')
    avatarUrl.value = profile.avatarUrl
  }
})

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
  avatarUrl.value = undefined
}
</script>

<template>
  <UHeader :toggle="false">
    <template #right>
      <UColorModeButton variant="link" />
      <UAvatar
        v-if="user"
        :src="avatarUrl"
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
