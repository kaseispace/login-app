import { serverSupabaseClient } from '#supabase/server'
import { createCategorySchema } from '#schemas/index'
import { Prisma } from '../../../prisma/generated/client'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)

  try {
    const input = createCategorySchema.parse(body)
    await prisma.category.create({
      data: {
        title: input.title,
        userId: user.id,
      },
    })
  }
  catch (err: unknown) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        data: z.treeifyError(err),
      })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Category already exists',
          data: { message: '同じ名前のカテゴリがすでに存在します' },
        })
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: '予期しないエラーが発生しました' },
    })
  }
})
