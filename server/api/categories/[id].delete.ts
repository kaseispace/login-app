import { serverSupabaseClient } from '#supabase/server'

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

  try {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category Not Found',
        data: { message: '指定されたはカテゴリは存在しません' },
      })
    }

    if (category.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        data: { message: 'このカテゴリを削除する権限がありません' },
      })
    }

    await prisma.category.delete({
      where: { id },
    })
  }
  catch (_err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: '予期しないエラーが発生しました' },
    })
  }
})
