'use client'

import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'

export default function HeroVanishInput() {

  const placeholders = [
    "I don't know what I'm good at…",
    "I feel lost and don't know where to start…",
    "I'm drifting through life without direction…",
    "I want to find something that matters…",
    "I feel stuck and need to discover my path…",
    "I'm searching for what makes me come alive…",
  ]

  return (
    <div className="mt-4 max-w-xl mx-auto">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={() => {}}
        onSubmit={(e) => {
          e.preventDefault()
          // Intentionally do nothing: stay on the hero after animation
        }}
      />
    </div>
  )
}


