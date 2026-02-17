<script setup lang="ts">
const { categoryList } = useCategories()
</script>

<template>
  <UPageGrid v-if="categoryList" class="items-start">
    <UCard v-for="category in categoryList" :key="category.id">
      <div class="relative flex items-center justify-center">
        <h3 class="text-lg font-semibold flex items-center gap-1">
          <UIcon name="i-lucide-tag" class="size-5 text-blue-500 dark:text-blue-300" />
          {{ category.title }}
        </h3>

        <div class="absolute right-0">
          <CategoryActionsMenu :id="category.id" :title="category.title" />
        </div>
      </div>

      <ul v-if="category.tasks.length > 0" class="mb-2">
        <li
          v-for="note in category.tasks"
          :key="note.id"
          class="flex gap-2 border-b border-gray-300 dark:border-gray-700 p-1"
        >
          <span class="text-gray-800 dark:text-gray-200 select-none w-4">
            □
          </span>

          <span class="text-gray-800 dark:text-gray-200 w-full">
            {{ note.content }}
          </span>

          <TaskCompleteButton :id="note.id" class="flex-none self-center" />
        </li>
      </ul>

      <p v-else>
        タスクはありません
      </p>

      <div class="flex items-center justify-center">
        <TaskAddModal :id="category.id" />
      </div>
    </UCard>
  </UPageGrid>
</template>
