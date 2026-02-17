import { serverSupabaseClient } from '#supabase/server'
import { Prisma } from '../../../prisma/generated/client'
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

  const id = Number(getRouterParam(event, 'id'))
  if (Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
      data: { message: 'IDが不正です' },
    })
  }

  const body = await readBody(event)

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category Not Found',
        data: { message: '指定されたカテゴリは存在しません' },
      })
    }

    if (category.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        data: { message: 'このカテゴリを編集する権限がありません' },
      })
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        title: body.title,
      },
    })

    return updated
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
