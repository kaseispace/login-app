import type { CreateTask } from '#schemas/index'

export const useTasks = () => {
  const createTask = async (input: CreateTask): Promise<CreateTask> => {
    try {
      return await $fetch<CreateTask>('/api/tasks', {
        method: 'POST',
        body: input,
      })
    }
    catch (err: unknown) {
      const error = err as { data?: unknown }
      throw error.data || error
    }
  }

  const deleteTask = async (id: number) => {
    try {
      return await $fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
    }
    catch (err: unknown) {
      const error = err as { data?: unknown }
      throw error.data || error
    }
  }

  return { createTask, deleteTask }
}
