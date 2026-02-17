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

  return prisma.category.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      tasks: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
})
