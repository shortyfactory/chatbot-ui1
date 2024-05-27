'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Callback() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const { code } = router.query

    if (!code) return () => {}

    const exchangeCodeForSession = async (code: any) => {
      try {
        await supabase.auth.exchangeCodeForSession(code)
      } catch (e) {
      } finally {
        router.replace('/')
      }
    }

    exchangeCodeForSession(code)

    return () => {}
  }, [router])

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2">
        <p className="text-center text-neutral-400">
          You&apos;ll be redirected shortly...
        </p>
      </div>
    </div>
  )
}
