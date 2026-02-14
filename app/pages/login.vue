<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const toast = useToast()

watchEffect(() => {
  if (user.value) {
    return navigateTo('/')
  }
})

const providers = [{
  label: 'Google',
  icon: 'i-flat-color-icons-google',
  onClick: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/confirm',
      },
    })
    if (error) displayError(error)
  },
}]

const displayError = (error: any) => {
  toast.add({
    title: 'Error',
    description: error.message,
    icon: 'i-lucide-alert-circle',
    color: 'error',
  })
}
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
