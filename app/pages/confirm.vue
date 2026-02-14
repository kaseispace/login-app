<script setup lang="ts">
const user = useSupabaseUser()

watch(user, async () => {
  if (user.value) {
    await $fetch('/api/users', {
      method: 'POST',
    })
    return navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <div>Waiting for login...</div>
</template>
