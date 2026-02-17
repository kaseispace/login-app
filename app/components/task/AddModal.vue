<script setup lang="ts">
import { createTaskSchema, ApiErrorSchema } from '#schemas/index'
import type { CreateTask } from '#schemas/index'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  id: number
}>()

const { refresh } = useCategories()
const { createTask } = useTasks()
const { showSuccess, showWarning, showError } = useAppToast()

const state = reactive<CreateTask>({
  content: '',
  categoryId: props.id,
})

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value,
})

const onSubmit = async (event: FormSubmitEvent<CreateTask>) => {
  try {
    await createTask(event.data)
    await refresh()
    showSuccess('タスクを追加しました', { progress: false })
    state.content = ''
    open.value = false
  }
  catch (err) {
    const parsed = ApiErrorSchema.safeParse(err)

    if (parsed.success) {
      const error = parsed.data
      showWarning(error.data.message || 'タスクの追加に失敗しました', { progress: false })
    }
    else {
      showError('予期しないエラーが発生しました', { progress: false })
    }
  }
}
</script>

<template>
  <UModal v-model:open="open" title="タスクを追加" description="タスク名を入力してください。">
    <UButton
      icon="i-lucide-plus"
      color="secondary"
      class="rounded-full"
      variant="subtle"
    />

    <template #body>
      <UForm :schema="createTaskSchema" :state="state" @submit="onSubmit">
        <UFormField label="タスク" name="title">
          <UInput v-model="state.content" class="w-full" color="neutral" />
        </UFormField>

        <div class="flex justify-end mt-3">
          <UButton type="submit" color="secondary">
            追加
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
