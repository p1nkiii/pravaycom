'use client'

import Link from 'next/link'

interface PlanViewerProps {
  plan: string
  conversationId: string
}

export default function PlanViewer({ conversationId }: PlanViewerProps) {
  return (
    <Link
      href={`/plan/${conversationId}`}
      className="text-gray-800 border border-gray-800 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      View Plan
    </Link>
  )
}

