<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <UHeader :toggle="false">
    <template #right>
      <UColorModeButton variant="link" />

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
