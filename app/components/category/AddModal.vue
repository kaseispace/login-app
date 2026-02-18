<script setup lang="ts">
import { createCategorySchema, ApiErrorSchema } from '#schemas/index'
import type { CreateCategory } from '#schemas/index'
import type { FormSubmitEvent } from '@nuxt/ui'

const { refresh, createCategory } = useCategories()
const { showSuccess, showWarning, showError } = useAppToast()

const state = reactive<CreateCategory>({
  title: '',
})

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value,
})

const onSubmit = async (event: FormSubmitEvent<CreateCategory>) => {
  try {
    await createCategory(event.data)
    await refresh()
    showSuccess('カテゴリを追加しました', { progress: false })
    state.title = ''
    open.value = false
  }
  catch (err) {
    const parsed = ApiErrorSchema.safeParse(err)

    if (parsed.success) {
      const error = parsed.data
      showWarning(error.data.message || 'カテゴリの追加に失敗しました', { progress: false })
    }
    else {
      showError('予期しないエラーが発生しました', { progress: false })
    }
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="新しいカテゴリを作成"
    description="カテゴリ名を入力してください。"
    :close="{
      variant: 'ghost',
      class: 'rounded-full cursor-pointer',
    }"
  >
    <UButton
      class="cursor-pointer"
      icon="i-lucide-pen"
      label="カテゴリを追加"
      color="secondary"
      variant="subtle"
    />

    <template #body>
      <UForm :schema="createCategorySchema" :state="state" @submit="onSubmit">
        <UFormField label="カテゴリ名" name="title">
          <UInput v-model="state.title" class="w-full" color="neutral" />
        </UFormField>

        <div class="flex justify-end mt-3">
          <UButton class="cursor-pointer" type="submit" color="secondary">
            作成
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
