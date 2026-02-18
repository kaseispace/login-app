<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const providers = ref<ButtonProps[]>([
  {
    label: 'Google',
    icon: 'i-flat-color-icons-google',
    onClick: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/confirm',
        },
      })
    },
    class: 'cursor-pointer',
  },
])

watchEffect(() => {
  if (user.value) {
    return navigateTo('/')
  }
})
</script>

<template>
  <UContainer class="h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center px-4">
    <UPageCard class="max-w-sm w-full">
      <UAuthForm
        title="ログイン"
        :providers="providers"
      >
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>
