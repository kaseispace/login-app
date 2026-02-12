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

export type User = z.infer<typeof UserSchema>

/* =========
   Inputs
========= */

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
})

export type CreateUser = z.input<typeof createUserSchema>
export type CreateUserOutput = z.output<typeof createUserSchema>

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
