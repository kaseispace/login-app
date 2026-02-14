import { serverSupabaseClient } from '#supabase/server'

interface MeResponse {
  avatarUrl: string | undefined
}

export default defineEventHandler(async (event): Promise<MeResponse> => {
  const supabase = await serverSupabaseClient(event)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw createError({ statusCode: 401 })
  }

  return {
    avatarUrl: user.user_metadata.avatar_url ?? undefined,
  }
})
