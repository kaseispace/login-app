<script setup lang="ts">
import { ApiErrorSchema } from '#schemas/index'

defineProps<{
  id: number
}>()

const { refresh } = useCategories()
const { deleteTask } = useTasks()
const { showSuccess, showWarning, showError } = useAppToast()

const deleteTaskById = async (id: number) => {
  try {
    await deleteTask(id)
    await refresh()
    showSuccess('タスクを削除しました', { progress: false })
  }
  catch (err) {
    const parsed = ApiErrorSchema.safeParse(err)

    if (parsed.success) {
      const error = parsed.data

      showWarning(error.data.message || 'タスクの削除に失敗しました', { progress: false })
    }
    else {
      showError('予期しないエラーが発生しました', { progress: false })
    }
  }
}
</script>

<template>
  <UButton
    icon="i-lucide-x"
    color="error"
    class="rounded-full"
    variant="soft"
    size="xs"
    @click="deleteTaskById(id)"
  />
</template>
