import { serverSupabaseClient } from '#supabase/server'
import { createTaskSchema } from '#schemas/index'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { message: 'セッション情報を取得できませんでした。ページを再読み込みしてから、もう一度お試しください。' },
    })
  }

  const body = await readBody(event)

  try {
    const input = createTaskSchema.parse(body)

    const category = await prisma.category.findFirst({
      where: {
        id: input.categoryId,
        userId: user.id,
      },
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
        data: { message: 'カテゴリが存在しません' },
      })
    }

    await prisma.task.create({
      data: {
        content: input.content,
        categoryId: input.categoryId,
      },
    })
  }
  catch (err: unknown) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        data: { message: '入力内容に誤りがあります' },
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: '予期しないエラーが発生しました' },
    })
  }
})
