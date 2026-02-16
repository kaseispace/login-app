<script setup lang="ts">
import { ApiErrorSchema } from '#schemas/index'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{
  id: number
  title: string
}>()

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value,
})

const { refresh, deleteCategory } = useCategories()
const { showSuccess, showWarning, showError } = useAppToast()

const deleteCategoryById = async (id: number) => {
  try {
    await deleteCategory(id)
    await refresh()
    showSuccess('カテゴリを削除しました', { progress: false })
  }
  catch (err) {
    const parsed = ApiErrorSchema.safeParse(err)

    if (parsed.success) {
      const error = parsed.data

      showWarning(error.data.message || 'カテゴリの削除に失敗しました', { progress: false })
    }
    else {
      showError('予期しないエラーが発生しました', { progress: false })
    }
  }
}

const items: DropdownMenuItem[][] = [
  [
    {
      label: '編集',
      icon: 'i-lucide-edit',
      onSelect: () => open.value = true,
    },
    {
      label: '削除',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect: () => deleteCategoryById(props.id),
    },
  ],
]
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', side: 'bottom' }"
    :ui="{ content: 'w-auto min-w-0' }"
  >
    <UButton
      class="rounded-full"
      color="neutral"
      variant="ghost"
      icon="i-lucide-ellipsis-vertical"
    />

    <CategoryEditModal :id="id" v-model:open="open" :title="title" />
  </UDropdownMenu>
</template>
