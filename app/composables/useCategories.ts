import type { CategoryWithTasks, CreateCategory } from '#schemas/index'

export const useCategories = () => {
  const { data: categoryList, pending, error, refresh } = useFetch<CategoryWithTasks[]>('/api/categories')

  const createCategory: (input: CreateCategory) => Promise<CreateCategory> = async (input) => {
    try {
      return await $fetch<CreateCategory>('/api/categories', {
        method: 'POST',
        body: input,
      })
    }
    catch (err: unknown) {
      const error = err as { data?: unknown }
      throw error.data || error
    }
  }

  const updateCategory = async (id: number, data: { title: string }) => {
    try {
      return await $fetch(`/api/categories/${id}`, {
        method: 'PUT',
        body: data,
      })
    }
    catch (err: unknown) {
      const error = err as { data?: unknown }
      throw error.data || error
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      return await $fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
    }
    catch (err: unknown) {
      const error = err as { data?: unknown }
      throw error.data || error
    }
  }

  return { categoryList, pending, error, refresh, createCategory, updateCategory, deleteCategory }
}
