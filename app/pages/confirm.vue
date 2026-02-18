<script setup lang="ts">
const user = useSupabaseUser()

watch(user, async () => {
  if (user.value) {
    await $fetch('/api/user', {
      method: 'POST',
    })
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <UContainer class="h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center px-4">
    <div>Waiting for login...</div>
  </UContainer>
</template>
