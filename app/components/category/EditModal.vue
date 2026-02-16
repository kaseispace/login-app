<script setup lang="ts">
import { createCategorySchema, ApiErrorSchema } from '#schemas/index'
import type { CreateCategory } from '#schemas/index'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  id: number | null
  title: string
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { refresh, updateCategory } = useCategories()
const { showSuccess, showWarning, showError } = useAppToast()

const state = reactive<CreateCategory>({
  title: props.title,
})

const onSubmit = async (event: FormSubmitEvent<CreateCategory>) => {
  try {
    if (props.id == null) {
      showError('カテゴリIDが不正です', { progress: false })
      return
    }

    await updateCategory(props.id, event.data)
    await refresh()
    showSuccess('カテゴリを編集しました', { progress: false })
    emit('update:open', false)
  }
  catch (err) {
    const parsed = ApiErrorSchema.safeParse(err)

    if (parsed.success) {
      const error = parsed.data
      showWarning(error.data.message || 'カテゴリの編集に失敗しました', { progress: false })
    }
    else {
      showError('予期しないエラーが発生しました', { progress: false })
    }
  }
}
</script>

<template>
  <UModal
    :open="open"
    title="カテゴリを編集"
    description="カテゴリ名を入力してください。"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <UForm :schema="createCategorySchema" :state="state" @submit="onSubmit">
        <UFormField label="カテゴリ名" name="title">
          <UInput v-model="state.title" class="w-full" color="neutral" />
        </UFormField>

        <div class="flex justify-end mt-3">
          <UButton type="submit" color="secondary">
            編集
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
