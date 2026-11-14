'use client'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Re-runs the page's server components whenever the admin saves or autosaves
export function RefreshRouteOnSave() {
  const router = useRouter()
  const [origin, setOrigin] = useState<string>()

  // Admin and site share an origin, so this is right on localhost, Vercel previews and production
  useEffect(() => setOrigin(window.location.origin), [])
  if (!origin) return null

  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={origin} />
}