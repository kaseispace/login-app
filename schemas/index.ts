import { z } from 'zod'

/* =========
   Models
========= */

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const TaskSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Task = z.infer<typeof TaskSchema>

export type User = z.infer<typeof UserSchema>

export const CategoryWithTasksSchema = CategorySchema.extend({
  tasks: z.array(TaskSchema),
})

export type CategoryWithTasks = z.infer<typeof CategoryWithTasksSchema>

/* =========
   Inputs
========= */

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

export type CreateUser = z.input<typeof createUserSchema>
export type CreateUserOutput = z.output<typeof createUserSchema>

export const createCategorySchema = z.object({
  title: z.string().min(1, 'カテゴリ名を入力してください').max(50, '50文字以内で入力してください'),
})

export type CreateCategory = z.infer<typeof createCategorySchema>

export const createTaskSchema = z.object({
  content: z.string().min(1, '内容を入力してください'),
  categoryId: z.number().nullable(),
})

export type CreateTask = z.infer<typeof createTaskSchema>

/* =========
   Errors
========= */

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  data: z
    .object({
      message: z.string(),
    }),
})

export type ApiError = z.infer<typeof ApiErrorSchema>
