'use client'

import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'

export default function HeroVanishInput() {

  const placeholders = [
    'I feel energized when I…',
    'I love spending time on…',
    "People say I'm great at…",
    'I deeply care about…',
    'I lose track of time when…',
    "I'd love to explore…",
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


