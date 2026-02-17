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
    const task = await prisma.task.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!task) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Task Not Found',
        data: { message: '指定されたタスクは存在しません' },
      })
    }

    if (task.category?.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        data: { message: 'このタスクを削除する権限がありません' },
      })
    }

    await prisma.task.delete({
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
